import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMonitor, 
  FiShoppingCart, 
  FiTarget, 
  FiRefreshCw, 
  FiCheck, 
  FiArrowRight, 
  FiX, 
  FiClock,
  FiZap,
  FiSmartphone,
  FiShield,
  FiHeadphones,
  FiStar
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCurrency } from '../hooks/useCurrency';
import './ServicesShowcase.css';

const WHATSAPP_NUMBER = '918353949006';

export const showcaseServices = [
  {
    id: 'business',
    title: 'Business Website',
    isPopular: true,
    popularBadgeText: 'Most Popular',
    colorTheme: 'theme-blue',
    icon: <FiMonitor />,
    description: 'Establish a powerful online presence for your business with a modern, professional and high-performing website.',
    features: [
      'Modern & Responsive Design',
      'SEO Optimized',
      'Contact & Inquiry Forms',
      'Fast Loading Speed',
      'Social Media Integration'
    ],
    priceINR: '₹6,999',
    priceUSD: '$149',
    priceValINR: 6999,
    priceValUSD: 149,
    billingType: 'One Time',
    deliveryTime: '5-7 Days',
    idealFor: 'Gyms, Restaurants, Schools, Hospitals, Real Estate & Corporate Agencies',
    fullDetails: 'Complete corporate-ready website engineered with modern UI/UX, lightning-fast Core Web Vitals, conversion-oriented layout, interactive contact inquiry forms, and Google Maps & Social integration.'
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Website',
    isPopular: false,
    colorTheme: 'theme-emerald',
    icon: <FiShoppingCart />,
    description: 'Sell your products online with a secure, fast and feature-rich e-commerce website.',
    features: [
      'Product Catalog & Filters',
      'Secure Payment Gateway',
      'Order & Inventory Management',
      'Mobile Responsive Design',
      'Easy Admin Panel'
    ],
    priceINR: '₹12,999',
    priceUSD: '$299',
    priceValINR: 12999,
    priceValUSD: 299,
    billingType: 'One Time',
    deliveryTime: '10-14 Days',
    idealFor: 'Clothing, Electronics, Cosmetics, Grocery, and D2C Brands',
    fullDetails: 'High-speed online shopping storefront with smooth product browsing, search & category filters, cart & checkout, multi-currency / UPI / Stripe / PayPal payments, and real-time inventory management.'
  },
  {
    id: 'landing',
    title: 'High-Converting Landing Page',
    isPopular: false,
    colorTheme: 'theme-purple',
    icon: <FiTarget />,
    description: 'Turn visitors into customers with laser-focused landing pages designed for maximum conversions.',
    features: [
      'Eye-Catching & Modern Design',
      'Compelling Copywriting',
      'CTA & Lead Capture Forms',
      'A/B Testing Ready',
      'Fast Loading & SEO Friendly'
    ],
    priceINR: '₹4,999',
    priceUSD: '$99',
    priceValINR: 4999,
    priceValUSD: 99,
    billingType: 'One Time',
    deliveryTime: '2-4 Days',
    idealFor: 'Coaches, Course Creators, PPC Ad Campaigns, SaaS & Product Launches',
    fullDetails: 'Single-page conversion powerhouse built to maximize your ROI on Google & Meta Ads. Features irresistible call-to-actions, WhatsApp triggers, and friction-free lead capture forms.'
  },
  {
    id: 'maintenance',
    title: 'Website Maintenance & SEO',
    isPopular: false,
    colorTheme: 'theme-amber',
    icon: <FiRefreshCw />,
    description: 'Keep your website secure, updated, and ranking high on search engines with our ongoing support and SEO services.',
    features: [
      'Regular Updates & Backup',
      'Bug Fixing & Security Monitoring',
      'On-Page & Off-Page SEO',
      'Performance Optimization',
      'Monthly Reports'
    ],
    priceINR: '₹2,999',
    priceUSD: '$59',
    priceValINR: 2999,
    priceValUSD: 59,
    billingType: 'Monthly',
    deliveryTime: 'Continuous Support',
    idealFor: 'Existing websites needing regular care, security scans, and Google ranking growth',
    fullDetails: 'Hassle-free 24/7 web management with weekly security scans, database backups, uptime monitoring, SEO keywords ranking tracking, speed maintenance, and priority developer support.'
  }
];

export default function ServicesShowcase({ showAnnotations = true, isStandalone = false }) {
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const [selectedService, setSelectedService] = useState(null);

  const isINR = !currency || currency.code === 'INR';

  const handleOpenService = (service, e) => {
    e.stopPropagation();
    setSelectedService(service);
  };

  const handleWhatsAppInquiry = (service) => {
    const priceText = isINR ? service.priceINR : service.priceUSD;
    const text = encodeURIComponent(`Hi DevSphere Global! I am interested in the ${service.title} (${priceText} ${service.billingType}). Could we discuss details?`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <section className="services-showcase-section" id="services-showcase">
      {/* Background Ambient Glows */}
      <div className="services-bg-glow" />
      <div className="services-bg-glow-popular" />

      <div className="services-container">
        
        {/* ── Section Header ── */}
        <div className="services-header">
          {/* Handwritten Callout - Left */}
          {showAnnotations && (
            <motion.div 
              className="handwritten-annotation handwritten-left"
              initial={{ opacity: 0, x: -20, rotate: -15 }}
              whileInView={{ opacity: 0.95, x: 0, rotate: -10 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span>Your Vision<br />Our Code</span>
              <svg className="handwritten-arrow" viewBox="0 0 40 40">
                <path d="M 5,8 Q 28,12 30,30 M 20,28 L 30,30 L 32,20" />
              </svg>
            </motion.div>
          )}

          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="services-top-badge">OUR SERVICES</span>
          </motion.div>

          {/* Main Title */}
          <motion.h2 
            className="services-main-title"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            We Build Websites That <span className="services-title-gradient">Grow Your Business</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p 
            className="services-main-subtitle"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            From business websites to e-commerce stores, we create modern, fast, and conversion-focused websites tailored to your goals.
          </motion.p>

          {/* Handwritten Callout - Right */}
          {showAnnotations && (
            <motion.div 
              className="handwritten-annotation handwritten-right"
              initial={{ opacity: 0, x: 20, rotate: 15 }}
              whileInView={{ opacity: 0.95, x: 0, rotate: 8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <svg className="handwritten-arrow" viewBox="0 0 40 40" style={{ transform: 'scaleX(-1)' }}>
                <path d="M 5,8 Q 28,12 30,30 M 20,28 L 30,30 L 32,20" />
              </svg>
              <span>Modern Design<br />Fast Performance<br />Real Results</span>
            </motion.div>
          )}
        </div>

        {/* ── 4 Service Showcase Cards Grid ── */}
        <div className="services-cards-grid">
          {showcaseServices.map((service, index) => {
            const priceDisplay = isINR ? service.priceINR : service.priceUSD;

            return (
              <motion.div
                key={service.id}
                className={`service-glow-card ${service.colorTheme} ${service.isPopular ? 'is-popular' : ''}`}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.12 }}
                whileHover={{ y: -8 }}
                onClick={(e) => handleOpenService(service, e)}
              >
                {/* Popular Badge if active */}
                {service.isPopular && (
                  <div className="popular-badge">
                    <span>👑</span> {service.popularBadgeText || 'Most Popular'}
                  </div>
                )}

                {/* Card Top: Icon & Header */}
                <div>
                  <div className="service-icon-box">
                    {service.icon}
                  </div>

                  <h3 className="service-card-title">{service.title}</h3>
                  <p className="service-card-desc">{service.description}</p>

                  {/* Feature Checklist */}
                  <ul className="service-features-list">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="service-feature-item">
                        <span className="service-feature-check">
                          <FiCheck size={11} strokeWidth={3} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Bottom: Pricing & Action Button */}
                <div className="service-pricing-wrap">
                  <div className="service-price-subtext">Starting from</div>
                  <div className="service-price-row">
                    <span className="service-price-amount">{priceDisplay}</span>
                    <span className="service-price-badge">{service.billingType}</span>
                  </div>

                  <button 
                    type="button"
                    className={`service-btn ${service.isPopular ? 'service-btn-gradient' : 'service-btn-outline'}`}
                    onClick={(e) => handleOpenService(service, e)}
                  >
                    <span>View Service</span>
                    <FiArrowRight size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Value & Trust Strip ── */}
        <motion.div 
          className="services-trust-strip"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="trust-item">
            <div className="trust-icon-box">
              <FiZap />
            </div>
            <div>
              <div className="trust-item-title">Fast Delivery</div>
              <div className="trust-item-sub">Get your website live quickly</div>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <FiSmartphone />
            </div>
            <div>
              <div className="trust-item-title">Mobile Responsive</div>
              <div className="trust-item-sub">Looks great on all devices</div>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <FiShield />
            </div>
            <div>
              <div className="trust-item-title">SEO Ready</div>
              <div className="trust-item-sub">Rank higher, get more traffic</div>
            </div>
          </div>

          <div className="trust-item">
            <div className="trust-icon-box">
              <FiHeadphones />
            </div>
            <div>
              <div className="trust-item-title">Dedicated Support</div>
              <div className="trust-item-sub">We're here when you need us</div>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom Link / Call to Action ── */}
        <motion.div 
          className="services-bottom-cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/contact" className="services-cta-link">
            <span>Let's Build Something Great <span className="services-cta-highlight">Together</span></span>
            <span className="services-cta-arrow-circle">
              <FiArrowRight />
            </span>
          </Link>
        </motion.div>

      </div>

      {/* ── Service Detail Interactive Modal ── */}
      <AnimatePresence>
        {selectedService && (
          <div className="service-modal-overlay" onClick={() => setSelectedService(null)}>
            <motion.div 
              className="service-modal-content"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="service-modal-close"
                onClick={() => setSelectedService(null)}
                aria-label="Close Modal"
              >
                <FiX size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div className="service-icon-box" style={{ margin: 0, width: 48, height: 48, fontSize: '1.25rem' }}>
                  {selectedService.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {selectedService.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Starting at</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>
                      {isINR ? selectedService.priceINR : selectedService.priceUSD}
                    </span>
                    <span className="service-price-badge">{selectedService.billingType}</span>
                  </div>
                </div>
              </div>

              <p style={{ color: '#cbd5e1', fontSize: '0.93rem', lineHeight: 1.68, marginBottom: '22px' }}>
                {selectedService.fullDetails}
              </p>

              {/* Delivery & Ideal For */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '22px' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>
                    <FiClock /> Delivery Timeline
                  </div>
                  <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.9rem' }}>
                    {selectedService.deliveryTime}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>
                    <FiStar /> Best Fit For
                  </div>
                  <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.84rem', lineHeight: 1.3 }}>
                    {selectedService.idealFor}
                  </div>
                </div>
              </div>

              {/* What is Included */}
              <div style={{ marginBottom: '26px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  What's Included
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                  {selectedService.features.map((feat, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: '#e2e8f0' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FiCheck size={12} />
                      </span>
                      {feat}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleWhatsAppInquiry(selectedService)}
                  style={{
                    flex: '1 1 200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: '#25D366',
                    color: '#ffffff',
                    border: 'none',
                    padding: '13px 20px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(37, 211, 102, 0.35)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FaWhatsapp size={18} />
                  <span>Inquire on WhatsApp</span>
                </button>

                <Link
                  to={`/contact?service=${encodeURIComponent(selectedService.title)}`}
                  style={{
                    flex: '1 1 160px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    padding: '13px 20px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.35)',
                    textAlign: 'center'
                  }}
                  onClick={() => setSelectedService(null)}
                >
                  <span>Get Free Quote</span>
                  <FiArrowRight size={16} />
                </Link>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
