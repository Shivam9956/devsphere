import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

const WHATSAPP_NUMBER = '918353949006';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20DevSphere%20Global!%20I%20visited%20your%20portfolio%20and%20I%27m%20interested%20in%20your%20services.`, '_blank');
  };

  return (
    <div className="whatsapp-btn-wrapper" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '0.85rem',
              color: 'var(--text)',
              maxWidth: '200px',
              textAlign: 'center',
              boxShadow: 'var(--shadow)'
            }}
          >
            Chat with DevSphere Global on WhatsApp!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '58px', height: '58px',
          borderRadius: '50%',
          background: '#25D366',
          border: 'none',
          color: 'white',
          fontSize: '1.6rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
          cursor: 'pointer'
        }}
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp />
      </motion.button>

      <style>{`
        @media (max-width: 768px) {
          .whatsapp-btn-wrapper {
            right: auto !important;
            left: 20px !important;
            bottom: 20px !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}
