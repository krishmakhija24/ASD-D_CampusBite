// API routes and DB logic by Trish

import random
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from models import db, MenuItem, Order, OrderItem, CrowdStatus, CrowdReport
from metrics import (
    CANTEEN_CROWD_LEVEL,
    CANTEEN_ACTIVE_ORDERS,
    CANTEEN_ESTIMATED_WAIT_MINUTES,
    CANTEEN_ORDER_REVENUE_TOTAL,
    CANTEEN_ITEMS_ORDERED_TOTAL
)

api_bp = Blueprint('api', __name__)

CROWD_LEVEL_MAP = {
    'LOW': 1,
    'MODERATE': 2,
    'HIGH': 3,
    'PEAK': 4
}


def update_prometheus_metrics():
    """Sync current state with Prometheus gauges."""
    active_count = Order.query.filter(Order.status.in_(['PLACED', 'PREPARING'])).count()
    CANTEEN_ACTIVE_ORDERS.set(active_count)

    latest_status = CrowdStatus.query.order_by(CrowdStatus.id.desc()).first()
    if latest_status:
        CANTEEN_CROWD_LEVEL.set(CROWD_LEVEL_MAP.get(latest_status.level.upper(), 2))
        CANTEEN_ESTIMATED_WAIT_MINUTES.set(latest_status.estimated_wait_minutes)


# ---------------- CROWD TRACKING ----------------

@api_bp.route('/crowd', methods=['GET'])
def get_crowd_status():
    status = CrowdStatus.query.order_by(CrowdStatus.id.desc()).first()
    if not status:
        status = CrowdStatus(
            level='MODERATE',
            queue_count=8,
            estimated_wait_minutes=12,
            updated_by='AUTO'
        )
        db.session.add(status)
        db.session.commit()

    active_orders = Order.query.filter(Order.status.in_(['PLACED', 'PREPARING'])).count()
    update_prometheus_metrics()

    return jsonify({
        'status': status.to_dict(),
        'active_orders_count': active_orders,
        'server_time': datetime.now(timezone.utc).isoformat()
    }), 200


@api_bp.route('/crowd', methods=['POST'])
def update_crowd_status():
    data = request.get_json() or {}
    level = data.get('level', 'MODERATE').upper()
    if level not in CROWD_LEVEL_MAP:
        return jsonify({'error': 'Invalid crowd level. Use LOW, MODERATE, HIGH, or PEAK.'}), 400

    queue_count = int(data.get('queue_count', 10))
    wait_minutes = int(data.get('estimated_wait_minutes', 15))
    updated_by = data.get('updated_by', 'ADMIN')

    status = CrowdStatus(
        level=level,
        queue_count=queue_count,
        estimated_wait_minutes=wait_minutes,
        updated_by=updated_by
    )
    db.session.add(status)
    db.session.commit()

    update_prometheus_metrics()

    return jsonify({'message': 'Crowd status updated successfully', 'status': status.to_dict()}), 200


@api_bp.route('/crowd/report', methods=['POST'])
def report_crowd():
    data = request.get_json() or {}
    reported_level = data.get('reported_level', 'MODERATE').upper()
    student_roll = data.get('student_roll', 'STUDENT')
    queue_estimate = data.get('queue_estimate', 5)

    report = CrowdReport(
        student_roll=student_roll,
        reported_level=reported_level,
        queue_estimate=queue_estimate
    )
    db.session.add(report)
    db.session.commit()

    return jsonify({
        'message': 'Thanks for reporting! Live crowd statistics updated.',
        'report': report.to_dict()
    }), 201


# ---------------- LIVE MENU ----------------

@api_bp.route('/menu', methods=['GET'])
def get_menu():
    category = request.args.get('category')
    search = request.args.get('search')
    available_only = request.args.get('available_only', 'false').lower() == 'true'

    query = MenuItem.query
    if category and category != 'All':
        query = query.filter(MenuItem.category == category)
    if search:
        query = query.filter(MenuItem.name.ilike(f'%{search}%'))
    if available_only:
        query = query.filter(MenuItem.is_available.is_(True))

    items = query.all()
    return jsonify([item.to_dict() for item in items]), 200


@api_bp.route('/menu', methods=['POST'])
def add_menu_item():
    data = request.get_json() or {}
    required = ['name', 'price', 'category']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields: name, price, category'}), 400

    item = MenuItem(
        name=data['name'],
        category=data['category'],
        price=float(data['price']),
        prep_time_minutes=int(data.get('prep_time_minutes', 10)),
        is_veg=bool(data.get('is_veg', True)),
        is_available=bool(data.get('is_available', True)),
        image_url=data.get('image_url', ''),
        description=data.get('description', '')
    )
    db.session.add(item)
    db.session.commit()

    return jsonify({'message': 'Menu item created', 'item': item.to_dict()}), 201


@api_bp.route('/menu/<int:item_id>', methods=['PUT'])
def update_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)
    data = request.get_json() or {}

    if 'name' in data:
        item.name = data['name']
    if 'category' in data:
        item.category = data['category']
    if 'price' in data:
        item.price = float(data['price'])
    if 'prep_time_minutes' in data:
        item.prep_time_minutes = int(data['prep_time_minutes'])
    if 'is_veg' in data:
        item.is_veg = bool(data['is_veg'])
    if 'is_available' in data:
        item.is_available = bool(data['is_available'])
    if 'image_url' in data:
        item.image_url = data['image_url']
    if 'description' in data:
        item.description = data['description']

    db.session.commit()
    return jsonify({'message': 'Menu item updated', 'item': item.to_dict()}), 200


@api_bp.route('/menu/<int:item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Menu item deleted successfully'}), 200


# ---------------- ORDERS & PRE-ORDER QUEUE ----------------

@api_bp.route('/orders', methods=['POST'])
def place_order():
    data = request.get_json() or {}
    items_data = data.get('items', [])
    if not items_data:
        return jsonify({'error': 'Order must contain at least one item'}), 400

    student_name = data.get('student_name', 'Student User')
    student_roll = data.get('student_roll', 'ENG2024-001')
    payment_mode = data.get('payment_mode', 'UPI')

    # Generate token number
    token_suffix = random.randint(1000, 9999)
    token_number = f"CN-{token_suffix}"

    total_amount = 0.0
    order_items_objs = []
    max_prep_time = 10

    for it in items_data:
        menu_item_id = it.get('id')
        qty = int(it.get('quantity', 1))
        menu_item = MenuItem.query.get(menu_item_id) if menu_item_id else None

        if menu_item:
            item_name = menu_item.name
            price = menu_item.price
            category = menu_item.category
            if menu_item.prep_time_minutes > max_prep_time:
                max_prep_time = menu_item.prep_time_minutes
        else:
            item_name = it.get('name', 'Snack Item')
            price = float(it.get('price', 50.0))
            category = 'Snacks'

        item_total = price * qty
        total_amount += item_total

        order_item = OrderItem(
            menu_item_id=menu_item_id,
            item_name=item_name,
            price=price,
            quantity=qty
        )
        order_items_objs.append(order_item)

        # Prometheus tracking per item
        CANTEEN_ITEMS_ORDERED_TOTAL.labels(
            item_name=item_name,
            category=category
        ).inc(qty)

    # Calculate estimated wait time based on queue
    pending_orders = Order.query.filter(Order.status.in_(['PLACED', 'PREPARING'])).count()
    estimated_wait = max_prep_time + (pending_orders * 2)

    order = Order(
        token_number=token_number,
        student_name=student_name,
        student_roll=student_roll,
        payment_mode=payment_mode,
        status='PLACED',
        total_amount=total_amount,
        estimated_wait_minutes=estimated_wait
    )
    order.items = order_items_objs

    db.session.add(order)
    db.session.commit()

    # Prometheus tracking
    CANTEEN_ORDER_REVENUE_TOTAL.inc(total_amount)
    update_prometheus_metrics()

    return jsonify({
        'message': 'Order placed successfully! Keep your token ready for pickup.',
        'order': order.to_dict()
    }), 201


@api_bp.route('/orders', methods=['GET'])
def list_orders():
    roll = request.args.get('roll')
    status_filter = request.args.get('status')

    query = Order.query.order_by(Order.id.desc())
    if roll:
        query = query.filter(Order.student_roll == roll)
    if status_filter:
        query = query.filter(Order.status == status_filter)

    orders = query.limit(50).all()
    return jsonify([order.to_dict() for order in orders]), 200


@api_bp.route('/orders/<token_or_id>', methods=['GET'])
def get_order(token_or_id):
    if token_or_id.isdigit():
        order = Order.query.get(int(token_or_id))
    else:
        order = Order.query.filter_by(token_number=token_or_id.upper()).first()

    if not order:
        return jsonify({'error': 'Order token not found'}), 404

    # Calculate current queue position
    queue_position = Order.query.filter(
        Order.status.in_(['PLACED', 'PREPARING']),
        Order.id < order.id
    ).count() + 1 if order.status in ['PLACED', 'PREPARING'] else 0

    order_dict = order.to_dict()
    order_dict['queue_position'] = queue_position

    return jsonify(order_dict), 200


@api_bp.route('/orders/<int:order_id>/status', methods=['PATCH'])
def update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.get_json() or {}
    new_status = data.get('status', '').upper()

    valid_statuses = ['PLACED', 'PREPARING', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED']
    if new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Allowed: {valid_statuses}'}), 400

    order.status = new_status
    db.session.commit()

    update_prometheus_metrics()

    return jsonify({
        'message': f'Order #{order.token_number} status updated to {new_status}',
        'order': order.to_dict()
    }), 200


# ---------------- ANALYTICS & DASHBOARD ----------------

@api_bp.route('/analytics', methods=['GET'])
def get_analytics():
    total_orders = Order.query.count()
    completed_orders = Order.query.filter_by(status='COMPLETED').count()
    active_orders = Order.query.filter(Order.status.in_(['PLACED', 'PREPARING'])).count()

    total_revenue = db.session.query(db.func.sum(Order.total_amount)).filter(Order.status != 'CANCELLED').scalar() or 0.0

    crowd_status = CrowdStatus.query.order_by(CrowdStatus.id.desc()).first()

    # Recent orders
    recent_orders = [o.to_dict() for o in Order.query.order_by(Order.id.desc()).limit(10).all()]

    return jsonify({
        'total_orders': total_orders,
        'completed_orders': completed_orders,
        'active_orders': active_orders,
        'total_revenue': round(total_revenue, 2),
        'crowd_level': crowd_status.level if crowd_status else 'MODERATE',
        'estimated_wait_minutes': crowd_status.estimated_wait_minutes if crowd_status else 15,
        'recent_orders': recent_orders
    }), 200


# ---------------- SEED DATABASE ----------------

@api_bp.route('/seed', methods=['POST'])
def seed_data():
    from app import seed_initial_data
    seed_initial_data()
    return jsonify({'message': 'Canteen menu and crowd data initialized successfully!'}), 200
