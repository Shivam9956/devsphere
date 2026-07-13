import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiArrowRight } from 'react-icons/fi';

const faqs = [
  {
    category: 'General',
    items: [
      {
        q: 'What services does DevSphere Global offer?',
        a: 'We offer full-stack web development including custom websites, e-commerce platforms, web applications, REST API development, UI/UX design, and ongoing maintenance & support.'
      },
      {
        q: 'Do you work with international clients?',
        a: 'Yes! We work with clients from USA, UK, Canada, Australia, and worldwide. All communication is in English and we accommodate different time zones.'
      },
      {
        q: 'How do I get started?',
        a: 'Simply reach out via the Contact page or WhatsApp. We\'ll schedule a free consultation call to discuss your project requirements, timeline, and budget.'
      }
    ]
  },
  {
    category: 'Pricing & Payment',
    items: [
      {
        q: 'How much does a website cost?',
        a: 'Pricing depends on project complexity. Basic websites start at $299, advanced websites at $799, and full-stack applications at $1499. Custom quotes are available for larger projects.'
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept payments via Razorpay (UPI, Cards, NetBanking for Indian clients) and PayPal (international clients). Payments are secure and encrypted.'
      },
      {
        q: 'Do you offer payment in installments?',
        a: 'Yes! For larger projects, we typically work with a 50% upfront payment and 50% upon completion. Custom payment plans can be arranged.'
      },
      {
        q: 'Is there a refund policy?',
        a: 'We offer revisions until you\'re satisfied. If work hasn\'t started, a full refund is available. Once development begins, refunds are prorated based on work completed.'
      }
    ]
  },
  {
    category: 'Development Process',
    items: [
      {
        q: 'How long does it take to build a website?',
        a: 'Basic websites: 5-7 days. Advanced websites: 2-4 weeks. Full-stack applications: 4-8 weeks. Timeline depends on project complexity and your feedback speed.'
      },
      {
        q: 'What is your development process?',
        a: 'We follow a 4-step process: Discovery (requirements gathering) → Planning (wireframes & architecture) → Development (coding with regular updates) → Launch (testing, deployment & handover).'
      },
      {
        q: 'Will I be able to track my project progress?',
        a: 'Yes! Every client gets access to a personal dashboard where you can track project status, progress percentage, and receive real-time updates from our team.'
      },
      {
        q: 'How many revisions are included?',
        a: 'All packages include unlimited revisions during development. After launch, we offer 30 days of free support for bug fixes.'
      }
    ]
  },
  {
    category: 'Technical',
    items: [
      {
        q: 'What technologies do you use?',
        a: 'Frontend: React.js, HTML5, CSS3, JavaScript. Backend: Node.js, Express.js, Python. Database: MongoDB, MySQL. We also work with REST APIs, JWT auth, and cloud deployment.'
      },
      {
        q: 'Will my website be mobile-friendly?',
        a: 'Absolutely! All our websites are fully responsive and optimized for mobile, tablet, and desktop devices. We test across multiple screen sizes and browsers.'
      },
      {
        q: 'Do you provide hosting and domain setup?',
        a: 'We can help you set up hosting (Vercel, Render, AWS) and domain configuration. We recommend platforms based on your budget and traffic requirements.'
      },
      {
        q: 'Will I own the source code?',
        a: 'Yes! Upon final payment, you receive full ownership of the source code. We can also set up a GitHub repository for you.'
      }
    ]
  }
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 0', background: 'none', border: 'none', color: 'var(--text)',
          cursor: 'pointer', textAlign: 'left', gap: '16px', fontSize: '1rem', fontWeight: 600
        }}
      >
        {q}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ flexShrink: 0, color: 'var(--accent)' }}>
          <FiChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ color: 'var(--text2)', lineHeight: 1.8, paddingBottom: '20px', fontSize: '0.95rem' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container section">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title">Frequently Asked Questions</h1>
          <p className="section-subtitle">Everything you need to know about working with DevSphere Global</p>
        </motion.div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ marginBottom: '48px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--accent)' }}>
                {section.category}
              </h2>
              <div className="card" style={{ padding: '0 24px' }}>
                {section.items.map((item, j) => (
                  <FAQItem key={j} q={item.q} a={item.a} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--card)', borderRadius: '24px', border: '1px solid var(--border)', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💬</div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '12px' }}>Still have questions?</h2>
          <p style={{ color: 'var(--text2)', marginBottom: '28px' }}>
            Can't find the answer you're looking for? Reach out directly.
          </p>
          <Link to="/contact" className="btn btn-primary">
            Contact Us <FiArrowRight />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
