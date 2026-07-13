import React from 'react';
import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <div className="page-loader">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}
      >
        {/* Logo */}
        <motion.div
          className="loader-logo"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          DevSphere Global
        </motion.div>

        {/* Progress bar */}
        <div className="loader-bar">
          <div className="loader-bar-fill" />
        </div>

        <motion.p
          style={{ color: 'var(--text3)', fontSize: '0.82rem', letterSpacing: '0.05em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
}
