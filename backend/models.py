from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class MenuItem(db.Model):
    __tablename__ = 'menu_items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(50), nullable=False, default='Snacks') # Snacks, Beverages, Meals, Fast Food
    price = db.Column(db.Float, nullable=False)
    prep_time_minutes = db.Column(db.Integer, nullable=False, default=10)
    is_veg = db.Column(db.Boolean, default=True)
    is_available = db.Column(db.Boolean, default=True)
    image_url = db.Column(db.String(255), nullable=True)
    description = db.Column(db.String(255), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'price': self.price,
            'prep_time_minutes': self.prep_time_minutes,
            'is_veg': self.is_veg,
            'is_available': self.is_available,
            'image_url': self.image_url,
            'description': self.description
        }


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    token_number = db.Column(db.String(20), unique=True, nullable=False)
    student_name = db.Column(db.String(100), nullable=False)
    student_roll = db.Column(db.String(50), nullable=False)
    payment_mode = db.Column(db.String(30), nullable=False, default='UPI')
    status = db.Column(db.String(30), nullable=False, default='PLACED') # PLACED, PREPARING, READY_FOR_PICKUP, COMPLETED, CANCELLED
    total_amount = db.Column(db.Float, nullable=False, default=0.0)
    estimated_wait_minutes = db.Column(db.Integer, nullable=False, default=15)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    items = db.relationship('OrderItem', backref='order', cascade='all, delete-orphan', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'token_number': self.token_number,
            'student_name': self.student_name,
            'student_roll': self.student_roll,
            'payment_mode': self.payment_mode,
            'status': self.status,
            'total_amount': self.total_amount,
            'estimated_wait_minutes': self.estimated_wait_minutes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [item.to_dict() for item in self.items]
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    menu_item_id = db.Column(db.Integer, nullable=True)
    item_name = db.Column(db.String(120), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    def to_dict(self):
        return {
            'id': self.id,
            'menu_item_id': self.menu_item_id,
            'item_name': self.item_name,
            'price': self.price,
            'quantity': self.quantity,
            'subtotal': self.price * self.quantity
        }


class CrowdStatus(db.Model):
    __tablename__ = 'crowd_status'

    id = db.Column(db.Integer, primary_key=True)
    level = db.Column(db.String(20), nullable=False, default='MODERATE') # LOW, MODERATE, HIGH, PEAK
    queue_count = db.Column(db.Integer, nullable=False, default=12)
    estimated_wait_minutes = db.Column(db.Integer, nullable=False, default=15)
    updated_by = db.Column(db.String(50), nullable=False, default='ADMIN') # ADMIN, AUTO, STUDENT_CONSENSUS
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'level': self.level,
            'queue_count': self.queue_count,
            'estimated_wait_minutes': self.estimated_wait_minutes,
            'updated_by': self.updated_by,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class CrowdReport(db.Model):
    __tablename__ = 'crowd_reports'

    id = db.Column(db.Integer, primary_key=True)
    student_roll = db.Column(db.String(50), nullable=True)
    reported_level = db.Column(db.String(20), nullable=False)
    queue_estimate = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'student_roll': self.student_roll,
            'reported_level': self.reported_level,
            'queue_estimate': self.queue_estimate,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
