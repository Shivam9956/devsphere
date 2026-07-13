import React from 'react';
import { FiStar } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';

export default function TestimonialCard({ testimonial }) {
  const initials = testimonial.name
    ? testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
  const color = colors[testimonial.name?.charCodeAt(0) % colors.length] || '#6366f1';

  return (
    <div className="card" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      padding: '28px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Quote icon */}
      <div style={{
        position: 'absolute',
        top: 20, right: 20,
        color: 'var(--border2)',
        fontSize: '2rem',
        opacity: 0.5
      }}>
        <FaQuoteLeft />
      </div>

      {/* Stars */}
      <div style={{ display: 'flex', gap: '3px' }}>
        {[...Array(testimonial.rating || 5)].map((_, i) => (
          <FiStar key={i} size={15} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
        ))}
      </div>

      {/* Message */}
      <p style={{
        color: 'var(--text2)',
        lineHeight: 1.75,
        flex: 1,
        fontSize: '0.92rem',
        fontStyle: 'italic'
      }}>
        "{testimonial.message}"
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: `${color}20`,
          border: `2px solid ${color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color, fontWeight: 700, fontSize: '0.9rem', flexShrink: 0
        }}>
          {initials}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{testimonial.name}</div>
          <div style={{ color: 'var(--text3)', fontSize: '0.78rem', marginTop: '2px' }}>
            {[testimonial.role, testimonial.company, testimonial.country].filter(Boolean).join(' · ')}
          </div>
        </div>
      </div>
    </div>
  );
}
