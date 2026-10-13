import React, { useState } from 'react';

export default function LiveMenu({ menuItems, onAddToCart, cartItems }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietFilter, setDietFilter] = useState('ALL'); // ALL, VEG, NON_VEG
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Snacks', 'Meals', 'Fast Food', 'Beverages'];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDiet = dietFilter === 'ALL' ||
                        (dietFilter === 'VEG' && item.is_veg) ||
                        (dietFilter === 'NON_VEG' && !item.is_veg);
    return matchesCategory && matchesSearch && matchesDiet;
  });

  const getItemCartQty = (itemId) => {
    const found = cartItems.find((ci) => ci.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Title & Filter Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
          🍽️ Live Canteen Menu
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Pre-order fresh hot snacks directly to skip the long payment queue. Collect with your token number!
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        marginBottom: '1.75rem'
      }}>
        {/* Categories */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? '#f97316' : '#0f172a',
                color: selectedCategory === cat ? '#ffffff' : '#cbd5e1',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '0.45rem 0.9rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Veg Toggle */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#0f172a', borderRadius: '8px', border: '1px solid #334155', overflow: 'hidden' }}>
            <button
              onClick={() => setDietFilter('ALL')}
              style={{
                background: dietFilter === 'ALL' ? '#334155' : 'transparent',
                color: '#f8fafc',
                border: 'none',
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All
            </button>
            <button
              onClick={() => setDietFilter('VEG')}
              style={{
                background: dietFilter === 'VEG' ? '#10b981' : 'transparent',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🟢 Veg
            </button>
            <button
              onClick={() => setDietFilter('NON_VEG')}
              style={{
                background: dietFilter === 'NON_VEG' ? '#ef4444' : 'transparent',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🔴 Non-Veg
            </button>
          </div>

          <input
            type="text"
            placeholder="Search samosa, dosa, coffee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '0.5rem 0.9rem',
              color: '#f8fafc',
              fontSize: '0.875rem',
              minWidth: '220px'
            }}
          />
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredItems.map((item) => {
          const qty = getItemCartQty(item.id);
          return (
            <div
              key={item.id}
              className="card-hover"
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {/* Image Banner */}
              <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80'}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />

                {/* Dietary badge */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: item.is_veg ? '#10b981' : '#ef4444'
                  }}></span>
                  {item.is_veg ? 'Veg' : 'Non-Veg'}
                </div>

                {/* Prep time badge */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(6px)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#f59e0b'
                }}>
                  ⚡ ~{item.prep_time_minutes}m prep
                </div>
              </div>

              {/* Item Details */}
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    {item.name}
                  </h4>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f97316' }}>
                    ₹{item.price}
                  </span>
                </div>

                <p style={{
                  fontSize: '0.825rem',
                  color: '#94a3b8',
                  lineHeight: '1.4',
                  marginBottom: '1.25rem',
                  flex: 1
                }}>
                  {item.description || 'Freshly prepared at the canteen kitchen.'}
                </p>

                {/* Action button */}
                {item.is_available ? (
                  <button
                    onClick={() => onAddToCart(item)}
                    style={{
                      background: qty > 0 ? '#10b981' : '#f97316',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.6rem',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      transition: 'background 0.2s'
                    }}
                  >
                    {qty > 0 ? `✓ Added (${qty}) - Add More` : '+ Pre-Order Item'}
                  </button>
                ) : (
                  <button
                    disabled
                    style={{
                      background: '#334155',
                      color: '#94a3b8',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.6rem',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'not-allowed'
                    }}
                  >
                    Sold Out Today
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1rem',
          background: '#1e293b',
          borderRadius: '16px',
          border: '1px solid #334155',
          marginTop: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No canteen items matched your search</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Try clearing your filters or search keywords.</p>
        </div>
      )}
    </div>
  );
}
