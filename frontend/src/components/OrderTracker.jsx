import React, { useState, useEffect } from 'react';

export default function OrderTracker({ activeToken, onFetchOrder }) {
  const [searchToken, setSearchToken] = useState(activeToken || 'CN-1021');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadOrder = async (token) => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const data = await onFetchOrder(token);
      if (data && !data.error) {
        setOrderData(data);
      } else {
        setError(data?.error || 'Order token not found');
        setOrderData(null);
      }
    } catch (err) {
      setError('Unable to fetch order: ' + err.message);
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeToken) {
      setSearchToken(activeToken);
      loadOrder(activeToken);
    } else {
      loadOrder('CN-1021');
    }
  }, [activeToken]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadOrder(searchToken.trim().toUpperCase());
  };

  const STAGES = [
    { key: 'PLACED', label: 'Order Received', desc: 'Sent to Kitchen Display' },
    { key: 'PREPARING', label: 'Kitchen Preparing', desc: 'Cooking & Assembling' },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'Collect at Counter #2' },
    { key: 'COMPLETED', label: 'Completed', desc: 'Enjoy your meal!' },
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'PLACED': return 0;
      case 'PREPARING': return 1;
      case 'READY_FOR_PICKUP': return 2;
      case 'COMPLETED': return 3;
      default: return 0;
    }
  };

  const currentIndex = orderData ? getStageIndex(orderData.status) : 0;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          🎫 Live Canteen Order & Token Tracker
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Check kitchen preparation status in real-time. No need to stand in the crowd!
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'inline-flex', gap: '0.5rem', marginTop: '1rem', maxWidth: '420px', width: '100%' }}>
          <input
            type="text"
            placeholder="Enter Token (e.g. CN-1021)"
            value={searchToken}
            onChange={(e) => setSearchToken(e.target.value)}
            style={{
              flex: 1,
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '0.65rem 1rem',
              color: '#f8fafc',
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#f97316',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.65rem 1.25rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Track
          </button>
        </form>

        {/* Quick Demo Tokens */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.75rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          <span>Try Demo Tokens:</span>
          {['CN-1021', 'CN-1022', 'CN-1023'].map((tok) => (
            <button
              key={tok}
              type="button"
              onClick={() => { setSearchToken(tok); loadOrder(tok); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#38bdf8',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontWeight: 600
              }}
            >
              {tok}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#f97316', fontWeight: 600 }}>
          Fetching real-time kitchen status...
        </div>
      )}

      {error && !loading && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          padding: '1.25rem',
          textAlign: 'center',
          color: '#fca5a5'
        }}>
          {error}
        </div>
      )}

      {orderData && !loading && (
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '18px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}>
          {/* Header Card */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #334155',
            paddingBottom: '1.5rem',
            marginBottom: '2rem',
            gap: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                Token Identifier
              </span>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.05em' }}>
                {orderData.token_number}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                Student: <strong>{orderData.student_name}</strong> ({orderData.student_roll})
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                background: orderData.status === 'READY_FOR_PICKUP' ? '#10b981' :
                            orderData.status === 'PREPARING' ? '#f59e0b' : '#38bdf8',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 800,
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '0.5rem'
              }}>
                {orderData.status.replace(/_/g, ' ')}
              </span>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Queue Position: <strong style={{ color: '#f8fafc' }}>{orderData.queue_position > 0 ? `#${orderData.queue_position}` : 'Counter Pickup!'}</strong>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              position: 'relative',
              gap: '0.5rem'
            }}>
              {STAGES.map((stg, idx) => {
                const isPassed = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <div key={stg.key} style={{ textAlign: 'center', position: 'relative' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      margin: '0 auto 0.5rem auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      background: isCurrent ? '#f97316' : isPassed ? '#10b981' : '#0f172a',
                      color: '#ffffff',
                      border: `2px solid ${isCurrent ? '#f97316' : isPassed ? '#10b981' : '#334155'}`,
                      boxShadow: isCurrent ? '0 0 15px rgba(249, 115, 22, 0.6)' : 'none'
                    }}>
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <div style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: isCurrent ? '#f97316' : isPassed ? '#10b981' : '#94a3b8'
                    }}>
                      {stg.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
                      {stg.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Item Details */}
          <div style={{ background: '#0f172a', borderRadius: '12px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.75rem' }}>
              Order Breakdown
            </h4>
            {orderData.items && orderData.items.map((it, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.4rem 0',
                  fontSize: '0.85rem',
                  borderBottom: idx < orderData.items.length - 1 ? '1px solid #1e293b' : 'none'
                }}
              >
                <span style={{ color: '#cbd5e1' }}>{it.quantity}x {it.item_name}</span>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>₹{it.price * it.quantity}</span>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              marginTop: '0.5rem',
              borderTop: '1px solid #334155',
              fontWeight: 800,
              fontSize: '1rem'
            }}>
              <span style={{ color: '#cbd5e1' }}>Total Paid:</span>
              <span style={{ color: '#f97316' }}>₹{orderData.total_amount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
