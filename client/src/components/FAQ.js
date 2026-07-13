import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

const faqs = [
  {
    q: 'How long does it take to build a website?',
    a: 'Basic Website: 7 days, Advanced Website: 2-3 weeks, Full Stack App: 4-6 weeks, Digital Marketing: Monthly. Rush delivery available.'
  },
  {
    q: 'What technologies do you use?',
    a: 'React.js, Node.js, MongoDB, Express.js, Stripe for payments, Cloudinary for images, and more.'
  },
  {
    q: 'Do you provide support after delivery?',
    a: 'Yes! Basic Website: 1 month, Advanced Website: 3 months, Full Stack App: 6 months, Digital Marketing: 2 months of free support.'
  },
  {
    q: 'Can I request changes after delivery?',
    a: 'Yes, minor changes are included in the support period. Major changes are billed separately.'
  },
  {
    q: 'Do you work with international clients?',
    a: 'Absolutely! I work with clients from USA, UK, Canada, Australia, and worldwide.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Stripe (credit/debit cards), PayPal, and bank transfer. 50% upfront, 50% on delivery.'
  },
  {
    q: 'Will my website be mobile-friendly?',
    a: 'Yes, all websites are fully responsive and tested on mobile, tablet, and desktop.'
  },
  {
    q: 'Can you redesign my existing website?',
    a: "Yes! Share your current website and requirements, I'll provide a free quote."
  }
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {faqs.map((faq, i) => (
        <motion.div
          key={i}
          className="card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          style={{ overflow: 'hidden', border: `1px solid ${open === i ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`, transition: 'border-color 0.2s' }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', background: 'none', border: 'none', cursor: 'pointer', padding: '18px 20px', textAlign: 'left', color: 'var(--text)' }}
          >
            <span style={{ fontWeight: 600, fontSize: '0.97rem', lineHeight: 1.4 }}>{faq.q}</span>
            <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: open === i ? 'rgba(99,102,241,0.15)' : 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: open === i ? 'var(--accent)' : 'var(--text2)', transition: 'all 0.2s' }}>
              {open === i ? <FiMinus size={14} /> : <FiPlus size={14} />}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <p style={{ padding: '0 20px 18px', color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.75, margin: 0 }}>
                  {faq.a}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
