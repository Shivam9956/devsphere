import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import api from '../api/axios';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const [verified, setVerified] = useState(false);
  const sessionId = params.get('session_id');

  useEffect(() => {
    if (sessionId) {
      api.get(`/payments/verify/${sessionId}`).then(r => setVerified(r.data.success)).catch(() => {});
    }
  }, [sessionId]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px' }}>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '2px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2.5rem', color: 'var(--green)' }}>
          <FiCheckCircle />
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Payment Successful!</h1>
      <p style={{ color: 'var(--text2)', marginBottom: '32px', lineHeight: 1.7 }}>
          Thank you for your payment. DevSphere Global will reach out within 24 hours to discuss your project details and get started.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn btn-primary">Contact Me <FiArrowRight /></Link>
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </motion.div>
    </div>
  );
}
