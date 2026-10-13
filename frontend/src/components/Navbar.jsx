import React from 'react';

export default function Navbar({ activeTab, setActiveTab, cartCount, openCart }) {
  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #334155',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 1.5rem'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('crowd')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            fontSize: '1.75rem',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            padding: '0.35rem 0.65rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
          }}>
            🍔
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#f8fafc' }}>
              Campus<span style={{ color: '#f97316' }}>Bite</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
              Canteen Queue & Crowd Tracker
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'crowd', label: '📊 Live Crowd', badge: 'Live' },
            { id: 'menu', label: '🍕 Menu & Pre-Order' },
            { id: 'track', label: '🎫 Track Token' },
            { id: 'admin', label: '⚙️ Admin Desk' },
            { id: 'devops', label: '🗄️ DevOps Architecture' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? '#f97316' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                {tab.label}
                {tab.badge && (
                  <span style={{
                    fontSize: '0.65rem',
                    background: '#10b981',
                    color: '#ffffff',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '10px',
                    fontWeight: 700
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side cart trigger & sync pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#1e293b',
            border: '1px solid #334155',
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            color: '#10b981',
            fontWeight: 600
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              display: 'inline-block',
              boxShadow: '0 0 8px #10b981'
            }}></span>
            Synced
          </div>

          <button
            onClick={openCart}
            style={{
              background: '#f97316',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.5rem 1rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(249, 115, 22, 0.4)',
              transition: 'transform 0.15s'
            }}
          >
            🛒 Cart
            {cartCount > 0 && (
              <span style={{
                background: '#ffffff',
                color: '#ea580c',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
