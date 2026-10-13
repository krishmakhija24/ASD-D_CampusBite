import os
from flask import Flask, jsonify, send_from_directory, render_template
from flask_cors import CORS
from models import db, MenuItem, Order, OrderItem, CrowdStatus
from routes.api import api_bp, update_prometheus_metrics
from metrics import record_request_metrics, get_metrics_response

def create_app():
    app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Database Configuration: SQLite fallback, PostgreSQL when DATABASE_URL is set
    db_url = os.environ.get('DATABASE_URL', 'sqlite:///canteen.db')
    if db_url.startswith('postgres://'):
        db_url = db_url.replace('postgres://', 'postgresql://', 1)

    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    # Register Prometheus metrics middleware & route
    record_request_metrics(app)

    @app.route('/metrics')
    def metrics_endpoint():
        return get_metrics_response()

    @app.route('/health')
    def health_check():
        try:
            # Check database connection
            db.session.execute(db.text('SELECT 1'))
            db_status = 'connected'
        except Exception as e:
            db_status = f'error: {str(e)}'

        return jsonify({
            'status': 'healthy',
            'database': db_status,
            'service': 'college-canteen-backend',
            'version': '1.0.0'
        }), 200

    # Register API blueprint
    app.register_blueprint(api_bp, url_prefix='/api')

    # Root route serving full-featured responsive frontend
    @app.route('/')
    def root():
        dist_index = os.path.join(app.static_folder, 'index.html') if app.static_folder else None
        if dist_index and os.path.exists(dist_index):
            return send_from_directory(app.static_folder, 'index.html')
        return render_template('index.html')

    with app.app_context():
        db.create_all()
        seed_initial_data()
        update_prometheus_metrics()

    return app


def seed_initial_data():
    """Seed initial menu items, crowd status, and sample orders if database is empty."""
    if MenuItem.query.count() == 0:
        sample_items = [
            MenuItem(
                name="Crispy Samosa (2 pcs)",
                category="Snacks",
                price=30.0,
                prep_time_minutes=5,
                is_veg=True,
                is_available=True,
                image_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80",
                description="Hot fried golden samosas filled with spiced potatoes and served with mint chutney"
            ),
            MenuItem(
                name="Masala Dosa with Sambar",
                category="Meals",
                price=60.0,
                prep_time_minutes=12,
                is_veg=True,
                is_available=True,
                image_url="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80",
                description="Crispy fermented crepe filled with seasoned potato masala and hot lentil sambar"
            ),
            MenuItem(
                name="Paneer Butter Masala Thali",
                category="Meals",
                price=120.0,
                prep_time_minutes=15,
                is_veg=True,
                is_available=True,
                image_url="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80",
                description="Complete thali with rich paneer gravy, 3 rotis, jeera rice, salad and gulab jamun"
            ),
            MenuItem(
                name="Double Masala Cheese Maggi",
                category="Snacks",
                price=45.0,
                prep_time_minutes=7,
                is_veg=True,
                is_available=True,
                image_url="https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80",
                description="College canteen favorite 2-minute noodles tossed with butter and extra cheese"
            ),
            MenuItem(
                name="Veg Cheese Burger",
                category="Fast Food",
                price=70.0,
                prep_time_minutes=10,
                is_veg=True,
                is_available=True,
                image_url="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
                description="Crispy spiced herb patty topped with melted cheddar, lettuce and tangy mayo"
            ),
            MenuItem(
                name="Chicken Kathi Roll",
                category="Fast Food",
                price=90.0,
                prep_time_minutes=12,
                is_veg=False,
                is_available=True,
                image_url="https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80",
                description="Succulent spiced chicken chunks wrapped in a flaky paratha with sliced onions"
            ),
            MenuItem(
                name="Cold Coffee with Vanilla Scoop",
                category="Beverages",
                price=50.0,
                prep_time_minutes=4,
                is_veg=True,
                is_available=True,
                image_url="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80",
                description="Thick blended espresso shake topped with a scoop of vanilla ice cream"
            ),
            MenuItem(
                name="Kulhad Masala Chai",
                category="Beverages",
                price=15.0,
                prep_time_minutes=3,
                is_veg=True,
                is_available=True,
                image_url="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80",
                description="Aromatic ginger and cardamom infused Indian tea served in an earthen clay cup"
            )
        ]
        db.session.bulk_save_objects(sample_items)
        db.session.commit()

    if CrowdStatus.query.count() == 0:
        initial_crowd = CrowdStatus(
            level="MODERATE",
            queue_count=12,
            estimated_wait_minutes=15,
            updated_by="ADMIN"
        )
        db.session.add(initial_crowd)
        db.session.commit()

    if Order.query.count() == 0:
        sample_orders = [
            Order(
                token_number="CN-1021",
                student_name="Krish",
                student_roll="CS-2023-01",
                payment_mode="UPI",
                status="PREPARING",
                total_amount=105.0,
                estimated_wait_minutes=8
            ),
            Order(
                token_number="CN-1022",
                student_name="Trish",
                student_roll="CS-2023-02",
                payment_mode="UPI",
                status="PLACED",
                total_amount=60.0,
                estimated_wait_minutes=14
            ),
            Order(
                token_number="CN-1023",
                student_name="Tanay",
                student_roll="CS-2023-03",
                payment_mode="Cash",
                status="READY_FOR_PICKUP",
                total_amount=50.0,
                estimated_wait_minutes=0
            )
        ]
        for o in sample_orders:
            db.session.add(o)
        db.session.commit()

        # Add order items
        o1 = Order.query.filter_by(token_number="CN-1021").first()
        o2 = Order.query.filter_by(token_number="CN-1022").first()
        o3 = Order.query.filter_by(token_number="CN-1023").first()

        if o1 and o2 and o3:
            db.session.add(OrderItem(order_id=o1.id, item_name="Double Masala Cheese Maggi", price=45.0, quantity=1))
            db.session.add(OrderItem(order_id=o1.id, item_name="Masala Dosa with Sambar", price=60.0, quantity=1))
            db.session.add(OrderItem(order_id=o2.id, item_name="Masala Dosa with Sambar", price=60.0, quantity=1))
            db.session.add(OrderItem(order_id=o3.id, item_name="Cold Coffee with Vanilla Scoop", price=50.0, quantity=1))
            db.session.commit()


if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    print(f"[Canteen Tracker] Backend starting on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
