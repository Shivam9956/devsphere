import React from 'react';
import { FiStar, FiCheckCircle } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';

export default function TestimonialCard({ testimonial }) {
  const initials = testimonial.name
    ? testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const colorThemes = [
    { primary: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.25)' },
    { primary: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.25)' },
    { primary: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.25)' },
    { primary: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)' },
    { primary: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)' }
  ];
  const themeIndex = (testimonial.name?.charCodeAt(0) || 0) % colorThemes.length;
  const theme = colorThemes[themeIndex];

  return (
    <div className="card testimonial-card" style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '28px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease'
    }}>
      {/* Background Accent glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${theme.primary}, transparent)`
      }} />

      {/* Header: Tag + Rating + Quote Icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {testimonial.tag && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 10px',
              borderRadius: '20px',
              background: theme.bg,
              border: `1px solid ${theme.border}`,
              color: theme.primary,
              fontSize: '0.75rem',
              fontWeight: 600,
              width: 'fit-content'
            }}>
              {testimonial.tag}
            </span>
          )}

          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
            {[...Array(testimonial.rating || 5)].map((_, i) => (
              <FiStar key={i} size={15} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
            ))}
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text)', marginLeft: '4px' }}>
              {(testimonial.rating || 5).toFixed(1)}
            </span>
          </div>
        </div>

        <div style={{
          color: 'var(--border2)',
          fontSize: '1.6rem',
          opacity: 0.45,
          flexShrink: 0
        }}>
          <FaQuoteLeft />
        </div>
      </div>

      {/* Message */}
      <p style={{
        color: 'var(--text2)',
        lineHeight: 1.75,
        flex: 1,
        fontSize: '0.93rem',
        fontStyle: 'italic',
        margin: '6px 0'
      }}>
        "{testimonial.message}"
      </p>

      {/* Author Details & Verified Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: theme.bg,
            border: `2px solid ${theme.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.primary,
            fontWeight: 800,
            fontSize: '0.92rem',
            flexShrink: 0,
            boxShadow: `0 0 12px ${theme.primary}20`
          }}>
            {initials}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>
              {testimonial.name}
              <FiCheckCircle size={13} style={{ color: '#10b981' }} title="Verified Client" />
            </div>
            <div style={{ color: 'var(--text3)', fontSize: '0.78rem', marginTop: '2px', lineHeight: 1.3 }}>
              {[testimonial.role, testimonial.company].filter(Boolean).join(' · ')}
            </div>
            {testimonial.country && (
              <div style={{ color: 'var(--text3)', fontSize: '0.75rem', marginTop: '2px', opacity: 0.85 }}>
                📍 {testimonial.country}
              </div>
            )}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '3px 8px',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: '#10b981',
          whiteSpace: 'nowrap'
        }}>
          <span>✓</span> Verified
        </div>
      </div>
    </div>
  );
}
