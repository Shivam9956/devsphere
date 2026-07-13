import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Image skeleton */}
      <div style={{
        height: '200px',
        background: 'var(--card2)',
        animation: 'skeletonPulse 1.5s ease-in-out infinite'
      }} />
      {/* Body skeleton */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ height: '12px', width: '40%', borderRadius: '6px', background: 'var(--card2)', animation: 'skeletonPulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '18px', width: '80%', borderRadius: '6px', background: 'var(--card2)', animation: 'skeletonPulse 1.5s ease-in-out 0.1s infinite' }} />
        <div style={{ height: '12px', width: '100%', borderRadius: '6px', background: 'var(--card2)', animation: 'skeletonPulse 1.5s ease-in-out 0.2s infinite' }} />
        <div style={{ height: '12px', width: '70%', borderRadius: '6px', background: 'var(--card2)', animation: 'skeletonPulse 1.5s ease-in-out 0.3s infinite' }} />
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: '24px', width: '60px', borderRadius: '50px', background: 'var(--card2)', animation: `skeletonPulse 1.5s ease-in-out ${i * 0.1}s infinite` }} />
          ))}
        </div>
      </div>
      <style>{`
        @keyframes skeletonPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
