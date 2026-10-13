import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CrowdMeter from './components/CrowdMeter';
import LiveMenu from './components/LiveMenu';
import CartModal from './components/CartModal';
import OrderTracker from './components/OrderTracker';
import AdminDashboard from './components/AdminDashboard';
import MetricsBanner from './components/MetricsBanner';

export default function App() {
  const [activeTab, setActiveTab] = useState('crowd');
  const [crowdData, setCrowdData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeToken, setActiveToken] = useState('');

  // Fetch Crowd Status
  const fetchCrowd = async () => {
    try {
      const res = await fetch('/api/crowd');
      if (res.ok) {
        const data = await res.json();
        setCrowdData(data);
      }
    } catch (err) {
      console.error('Error fetching crowd status:', err);
    }
  };

  // Fetch Menu
  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        setMenuItems(data);
      }
    } catch (err) {
      console.error('Error fetching menu:', err);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // Fetch Analytics
  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  // Initial fetch and polling loop
  useEffect(() => {
    fetchCrowd();
    fetchMenu();
    fetchOrders();
    fetchAnalytics();

    const interval = setInterval(() => {
      fetchCrowd();
      fetchOrders();
      fetchAnalytics();
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  // Cart operations
  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.id === item.id);
      if (existing) {
        return prev.map((ci) => ci.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(itemId);
    } else {
      setCartItems((prev) => prev.map((ci) => ci.id === itemId ? { ...ci, quantity: newQty } : ci));
    }
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((ci) => ci.id !== itemId));
  };

  // Place Order
  const handlePlaceOrder = async (orderPayload) => {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to place order');
    }
    const data = await res.json();
    setCartItems([]);
    fetchOrders();
    fetchAnalytics();
    fetchCrowd();
    return data;
  };

  // Report Crowd Feedback
  const handleReportFeedback = async (feedbackPayload) => {
    try {
      const res = await fetch('/api/crowd/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackPayload)
      });
      if (res.ok) {
        fetchCrowd();
      }
    } catch (err) {
      console.error('Error submitting crowd report:', err);
    }
  };

  // Admin: Update Crowd
  const handleUpdateCrowd = async (crowdPayload) => {
    const res = await fetch('/api/crowd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crowdPayload)
    });
    if (res.ok) {
      fetchCrowd();
      fetchAnalytics();
    }
  };

  // Admin: Add Menu Item
  const handleAddMenuItem = async (itemPayload) => {
    const res = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemPayload)
    });
    if (res.ok) {
      fetchMenu();
    }
  };

  // Admin: Update Menu Item
  const handleUpdateMenuItem = async (itemId, updatePayload) => {
    const res = await fetch(`/api/menu/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    });
    if (res.ok) {
      fetchMenu();
    }
  };

  // Admin: Delete Menu Item
  const handleDeleteMenuItem = async (itemId) => {
    const res = await fetch(`/api/menu/${itemId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      fetchMenu();
    }
  };

  // Admin: Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      fetchOrders();
      fetchAnalytics();
      fetchCrowd();
    }
  };

  // Fetch single order for tracker
  const handleFetchOrder = async (token) => {
    const res = await fetch(`/api/orders/${token}`);
    return await res.json();
  };

  const handleViewToken = (token) => {
    setActiveToken(token);
    setActiveTab('track');
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
      />

      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {activeTab === 'crowd' && (
          <CrowdMeter
            crowdData={crowdData}
            onReportFeedback={handleReportFeedback}
            onNavigateMenu={() => setActiveTab('menu')}
          />
        )}

        {activeTab === 'menu' && (
          <LiveMenu
            menuItems={menuItems}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
          />
        )}

        {activeTab === 'track' && (
          <OrderTracker
            activeToken={activeToken}
            onFetchOrder={handleFetchOrder}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            crowdData={crowdData}
            onUpdateCrowd={handleUpdateCrowd}
            menuItems={menuItems}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            analytics={analytics}
          />
        )}

        {activeTab === 'devops' && (
          <MetricsBanner
            analytics={analytics}
            crowdData={crowdData}
          />
        )}
      </main>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onPlaceOrder={handlePlaceOrder}
        onViewToken={handleViewToken}
      />

      <footer style={{
        background: '#0f172a',
        borderTop: '1px solid #334155',
        padding: '1.25rem',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#64748b'
      }}>
        College Canteen Queue & Crowd Tracker • DevOps Lab Project by <strong>Krish, Trish & Tanay</strong> • Built with React, Flask, PostgreSQL, Docker, Jenkins & Prometheus
      </footer>
    </div>
  );
}
