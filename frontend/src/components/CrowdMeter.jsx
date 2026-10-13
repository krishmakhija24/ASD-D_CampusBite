import React, { useState } from 'react';

export default function CrowdMeter({ crowdData, onReportFeedback, onNavigateMenu }) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportLevel, setReportLevel] = useState('MODERATE');
  const [reportQueue, setReportQueue] = useState(10);
  const [studentRoll, setStudentRoll] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportMsg, setReportMsg] = useState('');

  const status = crowdData?.status || {
    level: 'MODERATE',
    queue_count: 12,
    estimated_wait_minutes: 15,
    updated_by: 'ADMIN'
  };

  const level = status.level.toUpperCase();

  const CROWD_CONFIG = {
    LOW: {
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.15)',
      border: 'rgba(16, 185, 129, 0.3)',
      text: 'Low Crowd',
      percentage: 25,
      icon: '🟢',
      advice: 'Great time to visit! Minimal queues at all counters with fastest turnaround time.',
      badgeClass: 'badge-low'
    },
    MODERATE: {
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.15)',
      border: 'rgba(245, 158, 11, 0.3)',
      text: 'Moderate Crowd',
      percentage: 55,
      icon: '🟡',
      advice: 'Normal college recess rush. Average wait time is around 10 to 15 minutes.',
      badgeClass: 'badge-moderate'
    },
    HIGH: {
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.15)',
      border: 'rgba(249, 115, 22, 0.3)',
      text: 'High Crowd',
      percentage: 80,
      icon: '🟠',
      advice: 'Long queues forming at snack & meal counters. Pre-ordering online saves up to 20 mins!',
      badgeClass: 'badge-high'
    },
    PEAK: {
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.15)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: 'Peak Rush Hour',
      percentage: 95,
      icon: '🔴',
      advice: 'Heavy lunch hour crowd! Walk-in wait exceeds 30+ mins. Strongly recommend online pre-order.',
      badgeClass: 'badge-peak'
    }
  };

  const currentCfg = CROWD_CONFIG[level] || CROWD_CONFIG.MODERATE;

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onReportFeedback({
      reported_level: reportLevel,
      queue_estimate: Number(reportQueue),
      student_roll: studentRoll || 'STUDENT'
    });
    setIsSubmitting(false);
    setReportMsg('Thank you! Your feedback has been factored into the live tracker.');
    setTimeout(() => {
      setShowReportModal(false);
      setReportMsg('');
    }, 1800);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Top Banner Alert */}
      <div style={{
        background: currentCfg.bg,
        border: `1px solid ${currentCfg.border}`,
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            fontSize: '3rem',
            background: 'rgba(15, 23, 42, 0.4)',
            width: '76px',
            height: '76px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${currentCfg.border}`
          }}>
            {currentCfg.icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <span style={{
                background: currentCfg.color,
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px'
              }}>
                {status.level} CROWD
              </span>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Updated: {status.updated_at ? new Date(status.updated_at).toLocaleTimeString() : 'Just now'} (by {status.updated_by})
              </span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              {currentCfg.text} in Main Canteen
            </h2>
            <p style={{ margin: '0.35rem 0 0 0', color: '#cbd5e1', fontSize: '0.95rem' }}>
              {currentCfg.advice}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowReportModal(true)}
            style={{
              background: '#334155',
              color: '#f8fafc',
              border: '1px solid #475569',
              borderRadius: '10px',
              padding: '0.65rem 1.15rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            📢 Report Crowd Status
          </button>
          <button
            onClick={onNavigateMenu}
            style={{
              background: '#f97316',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.65rem 1.25rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.35)'
            }}
          >
            ⚡ Pre-Order & Skip Line
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Card 1: Estimated Wait Time */}
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '14px',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
            Estimated Wait Time
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: currentCfg.color }}>
              ~{status.estimated_wait_minutes}
            </span>
            <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>minutes</span>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.825rem', color: '#cbd5e1' }}>
            Calculated from counter prep rate & queue throughput
          </div>
        </div>

        {/* Card 2: Queue Length */}
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '14px',
          padding: '1.5rem'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
            Live Queue Headcount
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38bdf8' }}>
              {status.queue_count}
            </span>
            <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>students waiting</span>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.825rem', color: '#cbd5e1' }}>
            Active students currently standing at payment counters
          </div>
        </div>

        {/* Card 3: Canteen Load Gauge */}
        <div style={{
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '14px',
          padding: '1.5rem'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
            Canteen Seating & Hall Capacity
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc' }}>
              {currentCfg.percentage}%
            </span>
            <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>occupied</span>
          </div>

          {/* Visual Progress Bar */}
          <div style={{
            background: '#0f172a',
            height: '10px',
            borderRadius: '6px',
            overflow: 'hidden',
            marginTop: '0.75rem'
          }}>
            <div style={{
              width: `${currentCfg.percentage}%`,
              height: '100%',
              background: `linear-gradient(90deg, #10b981, ${currentCfg.color})`,
              borderRadius: '6px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* How It Works & Timing Guide */}
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '1.75rem'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
          💡 Peak Hours Schedule & Best Times to Visit
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem'
        }}>
          {[
            { time: '08:30 AM - 10:30 AM', title: 'Breakfast Rush', level: 'Moderate', color: '#f59e0b' },
            { time: '10:30 AM - 12:15 PM', title: 'Post-Lecture Break', level: 'Low (Ideal)', color: '#10b981' },
            { time: '12:30 PM - 02:00 PM', title: 'Main Lunch Recess', level: 'Peak Crowd', color: '#ef4444' },
            { time: '02:00 PM - 05:00 PM', title: 'Snacks & Evening Tea', level: 'Low / Moderate', color: '#10b981' },
          ].map((slot, idx) => (
            <div key={idx} style={{
              background: '#0f172a',
              border: '1px solid #334155',
              padding: '1rem',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '0.75rem', color: slot.color, fontWeight: 700 }}>
                {slot.level}
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f8fafc', margin: '0.25rem 0' }}>
                {slot.title}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                ⏰ {slot.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Crowd Report Modal */}
      {showReportModal && (
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
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
              📢 Student Crowd Reporter
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Help your fellow college mates know if the canteen is currently packed or free!
            </p>

            {reportMsg ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                color: '#10b981',
                padding: '1rem',
                borderRadius: '8px',
                textAlign: 'center',
                fontWeight: 600
              }}>
                {reportMsg}
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                    How packed does the canteen counter look right now?
                  </label>
                  <select
                    value={reportLevel}
                    onChange={(e) => setReportLevel(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      color: '#f8fafc',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="LOW">🟢 Low (Walk right up, fast)</option>
                    <option value="MODERATE">🟡 Moderate (Few people ahead)</option>
                    <option value="HIGH">🟠 High (Noticeable line forming)</option>
                    <option value="PEAK">🔴 Peak (Crazy long line / crowded)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                    Estimated queue count (approx students in line): {reportQueue}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={reportQueue}
                    onChange={(e) => setReportQueue(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                    Your Roll No / Student ID (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS-2024-42"
                    value={studentRoll}
                    onChange={(e) => setStudentRoll(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      color: '#f8fafc',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    style={{
                      background: '#334155',
                      color: '#cbd5e1',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.6rem 1rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: '#f97316',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.6rem 1.25rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
