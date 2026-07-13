import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiArrowRight, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function NewsletterBanner() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/newsletter', { email });
      setSubscribed(true);
      setEmail('');
      toast.success('Successfully subscribed!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ padding: '64px 0' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ background: 'var(--gradient)', borderRadius: '20px', padding: 'clamp(32px, 5vw, 56px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
        >
          {/* Background decoration */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.4rem', color: '#fff' }}>
              <FiMail />
            </div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '12px' }}>
              Stay Updated with Web Dev Tips
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
              Get weekly articles on React, Node.js, and web development best practices.
            </p>

            {subscribed ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.2)', borderRadius: '50px', padding: '14px 28px', color: '#fff', fontWeight: 600, fontSize: '1rem' }}
              >
                <FiCheck size={18} /> You're subscribed! Thanks for joining.
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '460px', margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  style={{ flex: 1, minWidth: '220px', padding: '14px 18px', borderRadius: '10px', border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.95rem', outline: 'none', backdropFilter: 'blur(10px)' }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: '14px 24px', borderRadius: '10px', border: 'none', background: '#fff', color: '#6366f1', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Subscribing...' : <><FiArrowRight size={16} /> Subscribe</>}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
