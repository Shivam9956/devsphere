import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiSend, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function TestimonialForm() {
  const [form, setForm] = useState({ name: '', role: '', company: '', country: '', rating: 5, message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setLoading(true);
    try {
      await api.post('/testimonials', form);
      setSubmitted(true);
      toast.success('Thank you for your review!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ padding: '48px', textAlign: 'center' }}
          >
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: '1.6rem', color: '#10b981'
            }}>
              <FiCheck />
            </div>
            <h3 style={{ fontWeight: 700, marginBottom: '10px' }}>Thank you!</h3>
            <p style={{ color: 'var(--text2)', fontSize: '0.95rem' }}>
              Your testimonial has been submitted and will appear after review.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="card"
            style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '18px' }}
          >
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '1.1rem' }}>Leave a Review</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.88rem' }}>Share your experience working with me</p>
            </div>

            {/* Star Rating */}
            <div>
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                Rating *
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                      fontSize: '1.6rem',
                      color: star <= (hoverRating || form.rating) ? '#f59e0b' : 'var(--border2)',
                      transition: 'color 0.15s, transform 0.15s',
                      transform: star <= (hoverRating || form.rating) ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    <FiStar style={{ fill: star <= (hoverRating || form.rating) ? '#f59e0b' : 'none' }} />
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                  Your Name *
                </label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Smith" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                  Role / Title
                </label>
                <input name="role" value={form.role} onChange={handleChange} placeholder="CEO, Designer..." />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                  Company
                </label>
                <input name="company" value={form.company} onChange={handleChange} placeholder="Acme Inc." />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                  Country
                </label>
                <input name="country" value={form.country} onChange={handleChange} placeholder="USA, UK..." />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                Your Message *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Share your experience working with DevSphere Global..."
                required
                rows={4}
                style={{ resize: 'vertical', minHeight: '100px' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ alignSelf: 'flex-start', minWidth: '160px', justifyContent: 'center' }}
            >
              {loading ? 'Submitting...' : <><FiSend size={14} /> Submit Review</>}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
