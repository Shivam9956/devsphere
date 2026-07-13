import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/newsletter/subscribe', { email });
      toast.success(res.data.message);
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '80px 0', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            maxWidth: '560px', margin: '0 auto', textAlign: 'center'
          }}
        >
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.5rem', color: 'var(--accent)' }}>
            <FiMail />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>Stay Updated</h2>
          <p style={{ color: 'var(--text2)', marginBottom: '28px', lineHeight: 1.7 }}>
            Subscribe to get the latest articles, tips, and updates from DevSphere Global directly in your inbox.
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '420px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ whiteSpace: 'nowrap', padding: '12px 20px' }}>
              {loading ? '...' : <><FiSend /> Subscribe</>}
            </button>
          </form>
          <p style={{ color: 'var(--text2)', fontSize: '0.78rem', marginTop: '12px' }}>
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
