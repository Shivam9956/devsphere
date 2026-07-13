import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
      <div className="container" style={{ textAlign: 'center', padding: '60px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{
              fontSize: 'clamp(6rem, 20vw, 12rem)',
              fontWeight: 800,
              fontFamily: 'Space Grotesk, sans-serif',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
              marginBottom: '24px',
              letterSpacing: '-0.04em'
            }}
          >
            404
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '16px' }}
          >
            Page Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ color: 'var(--text2)', fontSize: '1rem', marginBottom: '40px', maxWidth: '420px', margin: '0 auto 40px' }}
          >
            Oops! The page you're looking for doesn't exist or has been moved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/" className="btn btn-primary">
              <FiHome size={16} /> Back to Home
            </Link>
            <button onClick={() => window.history.back()} className="btn btn-outline">
              <FiArrowLeft size={16} /> Go Back
            </button>
          </motion.div>
        </motion.div>

        {/* Decorative orbs */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: -1 }}>
          <div style={{
            position: 'absolute', width: '500px', height: '500px',
            borderRadius: '50%', background: 'radial-gradient(circle, #6366f1, #8b5cf6)',
            filter: 'blur(120px)', opacity: 0.06,
            top: '-100px', right: '-100px'
          }} />
          <div style={{
            position: 'absolute', width: '400px', height: '400px',
            borderRadius: '50%', background: 'radial-gradient(circle, #06b6d4, #6366f1)',
            filter: 'blur(120px)', opacity: 0.06,
            bottom: '-100px', left: '-100px'
          }} />
        </div>
      </div>
    </div>
  );
}
