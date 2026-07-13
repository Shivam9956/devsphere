import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiXCircle } from 'react-icons/fi';

export default function PaymentCancel() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '2px solid var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2.5rem', color: 'var(--red)' }}>
          <FiXCircle />
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Payment Cancelled</h1>
        <p style={{ color: 'var(--text2)', marginBottom: '32px', lineHeight: 1.7 }}>
          Your payment was cancelled. No charges were made. Feel free to try again or contact me if you have any questions.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/pricing" className="btn btn-primary">Try Again</Link>
          <Link to="/contact" className="btn btn-outline">Contact Me</Link>
        </div>
      </motion.div>
    </div>
  );
}
