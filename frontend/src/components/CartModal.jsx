import React, { useState } from 'react';

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
  onViewToken
}) {
  const [studentName, setStudentName] = useState('Krish');
  const [studentRoll, setStudentRoll] = useState('CS-2023-01');
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderResult = await onPlaceOrder({
        student_name: studentName,
        student_roll: studentRoll,
        payment_mode: paymentMode,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      });

      if (orderResult && orderResult.order) {
        setPlacedOrder(orderResult.order);
      }
    } catch (err) {
      alert('Error placing order: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (placedOrder) {
      onViewToken(placedOrder.token_number);
    }
    setPlacedOrder(null);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '20px',
        maxWidth: '520px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '1.75rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
            {placedOrder ? '🎉 Order Placed Successfully!' : '🛒 Pre-Order Snacks Cart'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: '#334155',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            ✕
          </button>
        </div>

        {placedOrder ? (
          /* Confirmation Screen */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px dashed #10b981',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
                Your Live Counter Pickup Token
              </span>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#f8fafc', letterSpacing: '0.05em', margin: '0.5rem 0' }}>
                {placedOrder.token_number}
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>
                Estimated kitchen prep time: <strong>~{placedOrder.estimated_wait_minutes} mins</strong>
              </p>
            </div>

            <div style={{ textAlign: 'left', background: '#0f172a', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Student Name:</span>
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>{placedOrder.student_name} ({placedOrder.student_roll})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Total Paid:</span>
                <span style={{ fontWeight: 700, color: '#f97316' }}>₹{placedOrder.total_amount} via {placedOrder.payment_mode}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Status:</span>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>⏳ {placedOrder.status}</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              style={{
                width: '100%',
                background: '#f97316',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)'
              }}
            >
              Track Order Token Now →
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart */
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🥪</div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>Your cart is empty</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Browse the live menu and add snacks to skip the line!</p>
          </div>
        ) : (
          /* Cart Form */
          <form onSubmit={handleSubmit}>
            {/* Items list */}
            <div style={{ marginBottom: '1.25rem', maxHeight: '200px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0',
                    borderBottom: '1px solid #334155'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>{item.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>₹{item.price} each</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                      style={{
                        background: '#334155',
                        border: 'none',
                        color: '#f8fafc',
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 700
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                      style={{
                        background: '#334155',
                        border: 'none',
                        color: '#f8fafc',
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 700
                      }}
                    >
                      +
                    </button>
                    <span style={{ fontWeight: 700, color: '#f97316', fontSize: '0.95rem', minWidth: '55px', textAlign: 'right' }}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#0f172a',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              marginBottom: '1.25rem'
            }}>
              <span style={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.95rem' }}>Subtotal Amount:</span>
              <span style={{ color: '#f97316', fontWeight: 800, fontSize: '1.25rem' }}>₹{subtotal}</span>
            </div>

            {/* Student details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Student Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '0.55rem',
                    color: '#f8fafc',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Roll Number
                </label>
                <input
                  type="text"
                  required
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '0.55rem',
                    color: '#f8fafc',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            {/* Payment method */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '0.4rem' }}>
                Payment Method
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {['UPI', 'Cash', 'Campus Card'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    style={{
                      background: paymentMode === mode ? '#f97316' : '#0f172a',
                      color: paymentMode === mode ? '#ffffff' : '#cbd5e1',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {mode === 'UPI' ? '📱 UPI' : mode === 'Cash' ? '💵 Cash' : '💳 Card'}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              {isSubmitting ? 'Confirming Order...' : `Pay ₹${subtotal} & Generate Token`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
