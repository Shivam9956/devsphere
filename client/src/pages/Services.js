import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import api from '../api/axios';
import { getIcon } from '../utils/iconMap';

const defaultServices = [
  { _id: '1', title: 'Business Website ⭐', description: 'Establish a powerful local & global presence with a custom-built website tailored for Gyms, Restaurants, Schools, Hospitals, Real Estate agencies, Manufacturers, Coaching institutes, and Travel agencies.', features: ['Gym, Restaurant, School & Hospital sites', 'Real Estate, Manufacturing & Travel agencies', '100% Mobile Responsive & Premium UI/UX', 'Fast Loading Speed & Search Engine Optimized', 'Interactive inquiry forms & Google Maps integration'], color: '#6366f1', startingPrice: 15000, priceLabel: '₹15,000 – ₹50,000' },
  { _id: '2', title: 'E-commerce Website', description: 'Fully loaded, secure online store to start selling your products online. Complete with advanced product filters, secure payments, inventory tracking, and custom invoices.', features: ['Tailored for Clothing, Electronics & Grocery', 'Perfect for Cosmetics & Furniture stores', 'Secure Payment Gateways (Stripe, UPI, PayPal)', 'Powerful Admin Dashboard & Inventory System', 'Automated Invoice and Order status updates'], color: '#8b5cf6', startingPrice: null, priceLabel: 'Custom Quote' },
  { _id: '3', title: 'High-Converting Landing Page', description: 'Laser-focused landing pages optimized to capture quality leads, boost conversions, and maximize the return on your Google and Facebook ad campaigns.', features: ['Optimized for Coaching & Course Creators', 'High-converting for Real Estate lead forms', 'Tailored for SaaS & local businesses', 'WhatsApp, Mailchimp & CRM integration', 'Ultra-fast loading & dynamic CTA buttons'], color: '#06b6d4', startingPrice: 8000, priceLabel: 'Starting from' },
  { _id: '4', title: 'Website Maintenance & SEO', description: 'Keep your website secure, updated, and ranking high on search engines with our recurring care packages for a worry-free web presence.', features: ['Regular content updates & UI bug fixes', 'Automated database backups & security scans', 'Performance optimization & Core Web Vitals', 'SEO strategy & Google Search Console tracking', 'Priority developer support'], color: '#10b981', startingPrice: 5000, priceLabel: '₹5,000 / Month' }
];

const process = [
  { step: '01', title: 'Discovery',   desc: 'We discuss your requirements, goals, and vision for the project.',  color: '#6366f1' },
  { step: '02', title: 'Planning',    desc: 'I create a detailed project plan with timeline and milestones.',     color: '#8b5cf6' },
  { step: '03', title: 'Development', desc: 'Building your project with regular updates and progress reports.',   color: '#06b6d4' },
  { step: '04', title: 'Launch',      desc: 'Testing, deployment, and handover with full documentation.',        color: '#10b981' }
];

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/services-manage')
      .then(r => setServices(r.data || []))
      .catch(() => {});
  }, []);

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container section">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '16px' }}>What I Offer</div>
          <h1 className="section-title" style={{ marginBottom: '16px' }}>Professional Services</h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            End-to-end web development solutions for global businesses
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="grid-2" style={{ marginBottom: '96px' }}>
          {services.map((s, i) => (
            <motion.div
              key={s._id || i}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ padding: '36px', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
              <div style={{ width: 60, height: 60, borderRadius: 16, background: `${s.color}15`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: '20px' }}>
                {s.icon && typeof s.icon === 'string' ? getIcon(s.icon) : (s.icon || getIcon('FiCode'))}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', fontWeight: 700 }}>{s.title}</h3>
              <p style={{ color: 'var(--text2)', lineHeight: 1.75, marginBottom: s.startingPrice ? '16px' : '24px', fontSize: '0.93rem' }}>{s.description || s.desc}</p>
              {(s.startingPrice || s.priceLabel) && (
                <div style={{ marginBottom: '20px', padding: '10px 16px', background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: '10px', display: 'inline-block' }}>
                  {s.startingPrice ? (
                    <>
                      <span style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>{s.priceLabel || 'Starting from'} </span>
                      <span style={{ color: s.color, fontWeight: 800, fontSize: '1.1rem' }}>₹{s.startingPrice.toLocaleString('en-IN')}</span>
                    </>
                  ) : (
                    <span style={{ color: s.color, fontWeight: 800, fontSize: '0.95rem' }}>{s.priceLabel}</span>
                  )}
                </div>
              )}
              {s.features?.length > 0 && (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {s.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text2)', fontSize: '0.9rem' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FiCheck size={11} style={{ color: s.color }} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        {/* Process */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '16px' }}>How I Work</div>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>My Process</h2>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>From idea to launch — a clear, transparent workflow</p>
        </motion.div>

        <div className="grid-4" style={{ marginBottom: '96px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '40px', left: '12.5%', right: '12.5%', height: '2px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4, #10b981)', opacity: 0.3, zIndex: 0 }} />
          {process.map((p, i) => (
            <motion.div key={i} className="card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ textAlign: 'center', padding: '32px 24px', position: 'relative', zIndex: 1 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${p.color}15`, border: `2px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.1rem', fontWeight: 800, color: p.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                {p.step}
              </div>
              <h3 style={{ marginBottom: '10px', fontWeight: 700, fontSize: '1rem' }}>{p.title}</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.875rem', lineHeight: 1.65 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', padding: '64px 48px', background: 'var(--card)', borderRadius: '24px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.06), transparent 70%)', pointerEvents: 'none' }} />
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '20px' }}>Get Started</div>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: '16px', position: 'relative' }}>Ready to build something great?</h2>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', position: 'relative', maxWidth: '480px', margin: '0 auto 36px' }}>
            Let's discuss your project and create something amazing together at DevSphere Global.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link to="/contact" className="btn btn-primary">Get Free Quote <FiArrowRight size={15} /></Link>
            <Link to="/pricing" className="btn btn-outline">View Pricing</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
