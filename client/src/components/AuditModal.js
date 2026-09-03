import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiZap, FiLock, FiClock, FiGlobe } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function AuditModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    goal: 'Speed & Core Web Vitals',
    details: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.name || !form.email) {
      toast.error('Please provide your name and email');
      return;
    }

    setLoading(true);
    try {
      await api.post('/contact/audit', form);
      setSubmitted(true);
      toast.success('Audit request received! Check your email/WhatsApp in 24 hours.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setForm({
      name: '',
      email: '',
      phone: '',
      website: '',
      goal: 'Speed & Core Web Vitals',
      details: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={handleReset}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px 28px',
            position: 'relative',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={handleReset}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text2)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 8px' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '2px solid rgba(16, 185, 129, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  fontSize: '2rem',
                  margin: '0 auto 20px'
                }}
              >
                <FiCheck />
              </div>

              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  color: 'var(--accent)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: '12px'
                }}
              >
                AUDIT REQUEST CONFIRMED
              </span>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text)' }}>
                You're on the list, {form.name.split(' ')[0]}! 🚀
              </h3>

              <p style={{ color: 'var(--text2)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '28px' }}>
                Shivam and the DevSphere Global team are preparing your custom <strong>Speed, UI/UX & SEO Audit Report</strong>. You will receive it at <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{form.email}</span> within 24 hours.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a
                  href={`https://wa.me/918353949006?text=Hi%20Shivam!%20I%20just%20requested%20a%20Free%20Audit%20for%20my%20website%20(${encodeURIComponent(form.website || 'my project')}).`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn"
                  style={{
                    background: '#25D366',
                    color: '#fff',
                    fontWeight: 700,
                    padding: '12px',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)'
                  }}
                >
                  <FaWhatsapp size={18} /> Want Faster Delivery? Chat on WhatsApp
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-outline"
                  style={{ justifyContent: 'center', padding: '12px' }}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '50px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)', color: 'var(--accent)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '12px' }}>
                <FiZap size={13} /> 100% FREE · NO OBLIGATION
              </div>

              {/* Title & Subtitle */}
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '8px', lineHeight: 1.3, color: 'var(--text)' }}>
                Claim Your Free <span className="gradient-text">Website & SEO Audit</span>
              </h2>

              <p style={{ color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '22px' }}>
                Get an actionable review of your website's speed, mobile conversion, and SEO bottlenecks delivered in 24h.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)' }}>
                      Your Name *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Morgan"
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)' }}>
                      Work Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="alex@company.com"
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)' }}>
                      Website URL or Concept
                    </label>
                    <input
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      placeholder="e.g. yoursite.com or 'New E-commerce'"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)' }}>
                      WhatsApp / Phone
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 or +91..."
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)' }}>
                    What is your #1 Goal / Challenge?
                  </label>
                  <select
                    name="goal"
                    value={form.goal}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.88rem' }}
                  >
                    <option value="Speed & Core Web Vitals">⚡ Boost Page Speed & Core Web Vitals</option>
                    <option value="UI/UX Redesign & Modernization">🎨 Modernize UI/UX Design & Brand Look</option>
                    <option value="Conversion Rate & Sales Boost">📈 Increase Conversion Rate & Leads/Sales</option>
                    <option value="SEO & Google Rankings">🔍 Improve SEO & Google Ranking</option>
                    <option value="New E-Commerce or Custom Web App">🛒 Build New E-Commerce / Full Stack App</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text2)' }}>
                    Any specific questions? (Optional)
                  </label>
                  <textarea
                    name="details"
                    value={form.details}
                    onChange={handleChange}
                    placeholder="Tell us any specific issues you're facing..."
                    rows={2}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.88rem', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', padding: '13px', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 700, marginTop: '6px' }}
                >
                  {loading ? 'Submitting Request...' : 'Get My Free Audit Report (in 24 Hours) ⚡'}
                </button>
              </form>

              {/* Trust badges footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  paddingTop: '16px',
                  marginTop: '16px',
                  borderTop: '1px solid var(--border)',
                  fontSize: '0.75rem',
                  color: 'var(--text3)'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiLock style={{ color: '#10b981' }} /> 100% Confidential
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiClock style={{ color: '#f59e0b' }} /> 24h Delivery
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiGlobe style={{ color: 'var(--accent)' }} /> Worldwide
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
