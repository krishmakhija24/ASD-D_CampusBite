import React, { useState, useEffect } from 'react';

export default function AdminDashboard({
  crowdData,
  onUpdateCrowd,
  menuItems,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  orders,
  onUpdateOrderStatus,
  analytics
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('orders'); // orders, crowd, menu
  const [crowdLevel, setCrowdLevel] = useState(crowdData?.status?.level || 'MODERATE');
  const [queueCount, setQueueCount] = useState(crowdData?.status?.queue_count || 12);
  const [waitTime, setWaitTime] = useState(crowdData?.status?.estimated_wait_minutes || 15);
  const [crowdSaveMsg, setCrowdSaveMsg] = useState('');

  // Add Item Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Snacks',
    price: 40,
    prep_time_minutes: 8,
    is_veg: true,
    is_available: true,
    description: '',
    image_url: ''
  });

  useEffect(() => {
    if (crowdData?.status) {
      setCrowdLevel(crowdData.status.level);
      setQueueCount(crowdData.status.queue_count);
      setWaitTime(crowdData.status.estimated_wait_minutes);
    }
  }, [crowdData]);

  const handleSaveCrowd = async (e) => {
    e.preventDefault();
    await onUpdateCrowd({
      level: crowdLevel,
      queue_count: Number(queueCount),
      estimated_wait_minutes: Number(waitTime),
      updated_by: 'ADMIN'
    });
    setCrowdSaveMsg('✓ Crowd status updated & synced to Prometheus metrics!');
    setTimeout(() => setCrowdSaveMsg(''), 3000);
  };

  const handleAddNewItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    await onAddMenuItem(newItem);
    setShowAddModal(false);
    setNewItem({
      name: '',
      category: 'Snacks',
      price: 40,
      prep_time_minutes: 8,
      is_veg: true,
      is_available: true,
      description: '',
      image_url: ''
    });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Top Header & Analytics Summary */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          ⚙️ Canteen Staff & Vendor Management Console
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Control live crowd alerts, manage kitchen preparation queues, and update menu prices in real time.
        </p>
      </div>

      {/* Analytics KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
            Today's Total Revenue
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '0.35rem' }}>
            ₹{analytics?.total_revenue || 0}
          </div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
            Active Kitchen Queue
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f97316', marginTop: '0.35rem' }}>
            {analytics?.active_orders || 0} Orders
          </div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
            Total Orders Logged
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.35rem' }}>
            {analytics?.total_orders || 0}
          </div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
            Current Status Level
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.35rem' }}>
            {crowdLevel}
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
        {[
          { id: 'orders', label: '📋 Kitchen Orders Queue' },
          { id: 'crowd', label: '🚦 Crowd Status Controller' },
          { id: 'menu', label: '🍱 Menu & Stock Manager' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id)}
            style={{
              background: activeAdminTab === tab.id ? '#f97316' : '#1e293b',
              color: activeAdminTab === tab.id ? '#ffffff' : '#cbd5e1',
              border: 'none',
              borderRadius: '8px',
              padding: '0.55rem 1rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Kitchen Orders Queue */}
      {activeAdminTab === 'orders' && (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
            Live Incoming Student Orders ({orders.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f97316' }}>
                      {ord.token_number}
                    </span>
                    <span style={{
                      background: ord.status === 'READY_FOR_PICKUP' ? '#10b981' :
                                  ord.status === 'PREPARING' ? '#f59e0b' :
                                  ord.status === 'COMPLETED' ? '#334155' : '#38bdf8',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '12px'
                    }}>
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {ord.created_at ? new Date(ord.created_at).toLocaleTimeString() : ''}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>
                    Student: <strong>{ord.student_name}</strong> ({ord.student_roll}) | Paid ₹{ord.total_amount} via {ord.payment_mode}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    Items: {ord.items && ord.items.map((i) => `${i.quantity}x ${i.item_name}`).join(', ')}
                  </div>
                </div>

                {/* Status action buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {ord.status === 'PLACED' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'PREPARING')}
                      style={{
                        background: '#f59e0b',
                        color: '#0f172a',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 0.9rem',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      ▶ Start Cooking
                    </button>
                  )}

                  {ord.status === 'PREPARING' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'READY_FOR_PICKUP')}
                      style={{
                        background: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 0.9rem',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      ✓ Mark Ready for Pickup
                    </button>
                  )}

                  {ord.status === 'READY_FOR_PICKUP' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'COMPLETED')}
                      style={{
                        background: '#38bdf8',
                        color: '#0f172a',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 0.9rem',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      🎉 Handed Over (Complete)
                    </button>
                  )}

                  {ord.status !== 'COMPLETED' && ord.status !== 'CANCELLED' && (
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'CANCELLED')}
                      style={{
                        background: '#334155',
                        color: '#f87171',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Crowd Status Controller */}
      {activeAdminTab === 'crowd' && (
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.75rem', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Override Live Crowd Level
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Updating this immediately updates student apps, wait times, and Prometheus gauges.
          </p>

          {crowdSaveMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid #10b981',
              color: '#10b981',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              {crowdSaveMsg}
            </div>
          )}

          <form onSubmit={handleSaveCrowd}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                Select Crowd Status Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {[
                  { id: 'LOW', label: '🟢 Low', color: '#10b981' },
                  { id: 'MODERATE', label: '🟡 Moderate', color: '#f59e0b' },
                  { id: 'HIGH', label: '🟠 High', color: '#f97316' },
                  { id: 'PEAK', label: '🔴 Peak', color: '#ef4444' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setCrowdLevel(lvl.id)}
                    style={{
                      background: crowdLevel === lvl.id ? lvl.color : '#0f172a',
                      color: '#ffffff',
                      border: `1px solid ${crowdLevel === lvl.id ? lvl.color : '#334155'}`,
                      borderRadius: '8px',
                      padding: '0.65rem 0.5rem',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                Estimated Queue Headcount: {queueCount} students
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={queueCount}
                onChange={(e) => setQueueCount(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                Estimated Average Wait Time: {waitTime} minutes
              </label>
              <input
                type="range"
                min="3"
                max="60"
                value={waitTime}
                onChange={(e) => setWaitTime(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: '#f97316',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem 1.5rem',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              Save & Broadcast Status Update
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Menu & Stock Manager */}
      {activeAdminTab === 'menu' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Live Menu Items ({menuItems.length})
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.55rem 1.15rem',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              + Add New Item
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {menuItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.category}</span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: '0.1rem 0' }}>{item.name}</h4>
                  </div>
                  <span style={{ fontWeight: 800, color: '#f97316', fontSize: '1.1rem' }}>₹{item.price}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => onUpdateMenuItem(item.id, { is_available: !item.is_available })}
                    style={{
                      flex: 1,
                      background: item.is_available ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      border: `1px solid ${item.is_available ? '#10b981' : '#ef4444'}`,
                      color: item.is_available ? '#10b981' : '#ef4444',
                      borderRadius: '6px',
                      padding: '0.4rem',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {item.is_available ? '✓ In Stock' : '✕ Out of Stock'}
                  </button>

                  <button
                    onClick={() => onDeleteMenuItem(item.id)}
                    style={{
                      background: '#334155',
                      border: 'none',
                      color: '#f87171',
                      borderRadius: '6px',
                      padding: '0.4rem 0.75rem',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{
            background: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '16px',
            maxWidth: '460px',
            width: '100%',
            padding: '1.75rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
              Add New Canteen Item
            </h3>
            <form onSubmit={handleAddNewItem}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paneer Roll"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '0.55rem', borderRadius: '8px', color: '#f8fafc' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '0.55rem', borderRadius: '8px', color: '#f8fafc' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', padding: '0.55rem', borderRadius: '8px', color: '#f8fafc' }}
                  >
                    <option value="Snacks">Snacks</option>
                    <option value="Meals">Meals</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ background: '#334155', color: '#cbd5e1', border: 'none', borderRadius: '8px', padding: '0.55rem 1rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0.55rem 1.25rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
