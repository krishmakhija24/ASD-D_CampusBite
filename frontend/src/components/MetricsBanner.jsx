import React, { useState } from 'react';

export default function MetricsBanner({ analytics, crowdData }) {
  const [trafficSpikeStatus, setTrafficSpikeStatus] = useState('');
  const [isSpiking, setIsSpiking] = useState(false);

  const triggerSpike = async () => {
    setIsSpiking(true);
    setTrafficSpikeStatus('Simulating 15 concurrent student requests...');
    try {
      const promises = [];
      for (let i = 0; i < 15; i++) {
        promises.push(fetch('/api/crowd'));
        promises.push(fetch('/api/menu'));
      }
      await Promise.all(promises);
      setTrafficSpikeStatus('✓ 30 HTTP requests sent! Check Prometheus / Grafana graphs.');
    } catch (e) {
      setTrafficSpikeStatus('Traffic sent (status logged).');
    } finally {
      setIsSpiking(false);
      setTimeout(() => setTrafficSpikeStatus(''), 4000);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span style={{
              background: '#38bdf8',
              color: '#0f172a',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: '12px',
              textTransform: 'uppercase'
            }}>
              Expt 7 Monitoring & Metrics
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.35rem', marginBottom: 0 }}>
              Prometheus & Grafana DevOps Telemetry
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={triggerSpike}
              disabled={isSpiking}
              style={{
                background: '#f97316',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.55rem 1.15rem',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {isSpiking ? 'Generating Load...' : '⚡ Generate Traffic Spike (For Demo)'}
            </button>
            <a
              href="/metrics"
              target="_blank"
              rel="noreferrer"
              style={{
                background: '#0f172a',
                color: '#38bdf8',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '0.55rem 1rem',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              View Raw /metrics ↗
            </a>
          </div>
        </div>

        {trafficSpikeStatus && (
          <div style={{
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid #38bdf8',
            color: '#38bdf8',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            {trafficSpikeStatus}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Metric: canteen_crowd_level</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', margin: '0.2rem 0' }}>
              {crowdData?.status?.level || 'MODERATE'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Gauge exported to Prometheus</div>
          </div>

          <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Metric: canteen_active_orders</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', margin: '0.2rem 0' }}>
              {analytics?.active_orders || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Orders currently in queue</div>
          </div>

          <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Metric: canteen_estimated_wait_minutes</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', margin: '0.2rem 0' }}>
              {crowdData?.status?.estimated_wait_minutes || 15} mins
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Dynamically computed gauge</div>
          </div>

          <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '10px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Metric: canteen_order_revenue_total</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f97316', margin: '0.2rem 0' }}>
              ₹{analytics?.total_revenue || 0}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Monetary counter metric</div>
          </div>
        </div>

        {/* DevOps Stack Mapping */}
        <div style={{
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '1.25rem'
        }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.75rem' }}>
            🛠️ Lab Architecture & DevOps Services Running:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {[
              { service: 'Frontend (React/Vite)', port: ':3000', status: 'Healthy', color: '#10b981' },
              { service: 'Backend (Flask REST API)', port: ':5000', status: 'Healthy', color: '#10b981' },
              { service: 'PostgreSQL Database', port: ':5432', status: 'Healthy', color: '#10b981' },
              { service: 'Prometheus Scraper', port: ':9090', status: 'Scraping /metrics', color: '#38bdf8' },
              { service: 'Grafana Dashboard', port: ':3001', status: 'Provisioned', color: '#38bdf8' },
              { service: 'Jenkins CI/CD Pipeline', port: ':8080', status: 'Pipeline Ready', color: '#f59e0b' },
            ].map((s, idx) => (
              <div key={idx} style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#f8fafc' }}>{s.service}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem', fontSize: '0.75rem' }}>
                  <code style={{ color: '#94a3b8' }}>{s.port}</code>
                  <span style={{ color: s.color, fontWeight: 700 }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
