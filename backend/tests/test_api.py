import pytest
import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models import db, MenuItem, Order, CrowdStatus

@pytest.fixture
def client():
    os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
    app = create_app()
    app.config['TESTING'] = True

    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client


def test_health_endpoint(client):
    """Expt 5/8 CI/CD Smoke test for health probe."""
    res = client.get('/health')
    assert res.status_code == 200
    data = res.get_json()
    assert data['status'] == 'healthy'
    assert data['service'] == 'college-canteen-backend'


def test_prometheus_metrics(client):
    """Expt 7 Prometheus scraping test."""
    res = client.get('/metrics')
    assert res.status_code == 200
    metrics_output = res.data.decode('utf-8')
    assert 'http_requests_total' in metrics_output
    assert 'canteen_crowd_level' in metrics_output


def test_get_crowd_status(client):
    """Test retrieving live canteen crowd level."""
    res = client.get('/api/crowd')
    assert res.status_code == 200
    data = res.get_json()
    assert 'status' in data
    assert data['status']['level'] in ['LOW', 'MODERATE', 'HIGH', 'PEAK']


def test_update_crowd_status(client):
    """Test admin changing crowd status."""
    payload = {
        'level': 'HIGH',
        'queue_count': 25,
        'estimated_wait_minutes': 35,
        'updated_by': 'ADMIN'
    }
    res = client.post('/api/crowd', json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data['status']['level'] == 'HIGH'
    assert data['status']['queue_count'] == 25


def test_get_menu(client):
    """Test retrieving live menu."""
    res = client.get('/api/menu')
    assert res.status_code == 200
    items = res.get_json()
    assert isinstance(items, list)
    assert len(items) > 0


def test_place_order(client):
    """Test pre-ordering snack item to skip line."""
    payload = {
        'student_name': 'Krish',
        'student_roll': 'CS-2023-01',
        'payment_mode': 'UPI',
        'items': [
            {'name': 'Crispy Samosa (2 pcs)', 'price': 30.0, 'quantity': 2}
        ]
    }
    res = client.post('/api/orders', json=payload)
    assert res.status_code == 201
    data = res.get_json()
    assert 'order' in data
    assert data['order']['token_number'].startswith('CN-')
    assert data['order']['total_amount'] == 60.0


def test_analytics(client):
    """Test analytics dashboard endpoint."""
    res = client.get('/api/analytics')
    assert res.status_code == 200
    data = res.get_json()
    assert 'total_orders' in data
    assert 'total_revenue' in data
