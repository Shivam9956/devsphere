import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import ServicesShowcase from '../components/ServicesShowcase';

const industries = [
  {
    icon: '🏥',
    title: 'Hospitals & Healthcare',
    desc: 'Patient booking systems, doctor profiles, dynamic inquiry forms, and HIPAA/data privacy compliance.'
  },
  {
    icon: '🏢',
    title: 'Real Estate & Builders',
    desc: 'Property listings with filters, virtual tour embeds, interactive floorplans, and WhatsApp lead capture.'
  },
  {
    icon: '🍽️',
    title: 'Restaurants & Cafes',
    desc: 'Interactive digital menu, online table reservations, Google Maps directions, and direct delivery integration.'
  },
  {
    icon: '🛍️',
    title: 'E-commerce & Retail',
    desc: 'High-speed catalog, inventory tracking, secure UPI/Stripe checkout, order confirmation SMS & invoice generation.'
  },
  {
    icon: '🏋️‍♂️',
    title: 'Gyms & Fitness Centers',
    desc: 'Membership plans showcase, trainer profiles, workout schedule calendar, and free trial booking forms.'
  },
  {
    icon: '🎓',
    title: 'Schools & Coaching',
    desc: 'Course syllabi, student admission forms, batch schedules, faculty bios, and direct WhatsApp consultations.'
  }
];

const process = [
  { step: '01', title: 'Discovery & Vision',   desc: 'We analyze your business requirements, target audience, and brand objectives.', color: '#3b82f6' },
  { step: '02', title: 'Design & Prototyping', desc: 'Crafting responsive, conversion-focused wireframes and UI mockups.', color: '#10b981' },
  { step: '03', title: 'High-Speed Development', desc: 'Building with modern clean code, SEO optimization, and database architecture.', color: '#a855f7' },
  { step: '04', title: 'Testing & Launch',      desc: 'Rigorous cross-device speed testing, security audit, and live server deployment.', color: '#f59e0b' }
];

const faqs = [
  {
    q: 'How quickly can you deliver my website?',
    a: 'Landing pages are typically completed within 2 to 4 days. Standard business websites take 5 to 7 days, and full-featured e-commerce platforms take 10 to 14 days.'
  },
  {
    q: 'Will my website work perfectly on mobile phones and tablets?',
    a: 'Yes! Every website we build is 100% responsive, pixel-perfect, and tested across iPhone, Android, iPads, and high-resolution monitors.'
  },
  {
    q: 'Can I easily update content or products later?',
    a: 'Yes, we provide an intuitive admin panel and full documentation so you can add products, edit text, and view incoming leads effortlessly.'
  },
  {
    q: 'Do you offer ongoing website maintenance and SEO support?',
    a: 'Yes, our Website Maintenance & SEO package covers weekly backups, software updates, speed optimization, and Google search ranking growth.'
  }
];

export default function Services() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="services-page-wrapper" style={{ background: '#050711', minHeight: '100vh', color: '#ffffff' }}>
      
      {/* ── Main Interactive Showcase Section ── */}
      <ServicesShowcase showAnnotations={true} isStandalone={true} />

      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* ── Industries We Serve ── */}
        <div style={{ marginTop: '40px', marginBottom: '90px' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <div style={{ display: 'inline-flex', padding: '5px 14px', borderRadius: '999px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
              Tailored Solutions
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '12px' }}>
              Built for Every Industry
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              We design specialized features tailored to the specific business goals of your niche.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '22px' }}>
            {industries.map((ind, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '28px',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.4)' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '14px' }}>{ind.icon}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>{ind.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>{ind.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Process ── */}
        <div style={{ marginBottom: '90px' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <div style={{ display: 'inline-flex', padding: '5px 14px', borderRadius: '999px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
              How We Work
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '12px' }}>
              Our 4-Step Launch Process
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
              From concept to live deployment with 100% transparency and fast turnaround.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {process.map((p, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 25 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }} 
                style={{ 
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '30px 22px', 
                  position: 'relative' 
                }}
              >
                <div style={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: '12px', 
                  background: `${p.color}20`, 
                  border: `1.5px solid ${p.color}50`, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: '18px', 
                  fontSize: '1rem', 
                  fontWeight: 800, 
                  color: p.color 
                }}>
                  {p.step}
                </div>
                <h3 style={{ marginBottom: '10px', fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>{p.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.86rem', lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ maxWidth: '820px', margin: '0 auto 90px' }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            style={{ textAlign: 'center', marginBottom: '40px' }}
          >
            <div style={{ display: 'inline-flex', padding: '5px 14px', borderRadius: '999px', background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.3)', color: '#c084fc', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
              Common Questions
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                style={{ 
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    color: '#f1f5f9',
                    fontSize: '1rem',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ color: '#818cf8', fontSize: '1.2rem', marginLeft: '12px' }}>
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </button>
                {openFaq === idx && (
                  <div style={{ padding: '0 24px 20px', color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.68 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Final Call to Action ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          style={{ 
            textAlign: 'center', 
            padding: '60px 36px', 
            background: 'linear-gradient(135deg, rgba(30, 41, 75, 0.7) 0%, rgba(15, 23, 42, 0.95) 100%)', 
            borderRadius: '24px', 
            border: '1px solid rgba(99, 102, 241, 0.3)', 
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.15)',
            position: 'relative', 
            overflow: 'hidden' 
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(99,102,241,0.12), transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ display: 'inline-flex', padding: '5px 14px', borderRadius: '999px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#93c5fd', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '18px' }}>
            Ready to Build?
          </div>
          
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#ffffff', marginBottom: '14px', position: 'relative' }}>
            Let's Create an Outstanding Website For You
          </h2>
          
          <p style={{ color: '#cbd5e1', fontSize: '1.02rem', position: 'relative', maxWidth: '540px', margin: '0 auto 34px', lineHeight: 1.68 }}>
            Get in touch with our engineering team today for a free project consultation and fast delivery estimate.
          </p>
          
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link 
              to="/contact" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)'
              }}
            >
              Get Free Consultation <FiArrowRight size={16} />
            </Link>
            
            <Link 
              to="/pricing" 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                textDecoration: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}
            >
              View Pricing Plans
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
