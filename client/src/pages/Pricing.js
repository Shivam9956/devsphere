import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCheck, FiUser, FiMail, FiGlobe, FiZap, 
  FiMonitor, FiShoppingCart, FiTarget, FiRefreshCw 
} from 'react-icons/fi';
import { SiRazorpay, SiPaypal } from 'react-icons/si';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCurrency } from '../hooks/useCurrency';
import PaymentBadges from '../components/PaymentBadges';

const defaultPlans = [
  {
    id: 'business',
    name: 'Business Website',
    priceUSD: 149,
    priceINR: 6999,
    delivery: '5-7 Days',
    billingType: 'One Time',
    desc: 'Establish a powerful online presence for your business with a modern, professional and high-performing website.',
    features: [
      'Modern & Responsive Design',
      'SEO Optimized',
      'Contact & Inquiry Forms',
      'Fast Loading Speed',
      'Social Media Integration'
    ],
    color: '#3b82f6',
    popular: true
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Website',
    priceUSD: 299,
    priceINR: 12999,
    delivery: '10-14 Days',
    billingType: 'One Time',
    desc: 'Sell your products online with a secure, fast and feature-rich e-commerce website.',
    features: [
      'Product Catalog & Filters',
      'Secure Payment Gateway',
      'Order & Inventory Management',
      'Mobile Responsive Design',
      'Easy Admin Panel'
    ],
    color: '#10b981',
    popular: false
  },
  {
    id: 'landing',
    name: 'High-Converting Landing Page',
    priceUSD: 99,
    priceINR: 4999,
    delivery: '2-4 Days',
    billingType: 'One Time',
    desc: 'Turn visitors into customers with laser-focused landing pages designed for maximum conversions.',
    features: [
      'Eye-Catching & Modern Design',
      'Compelling Copywriting',
      'CTA & Lead Capture Forms',
      'A/B Testing Ready',
      'Fast Loading & SEO Friendly'
    ],
    color: '#a855f7',
    popular: false
  },
  {
    id: 'maintenance',
    name: 'Website Maintenance & SEO',
    priceUSD: 69,
    priceINR: 2999,
    delivery: 'Continuous Support',
    billingType: 'Monthly',
    desc: 'Keep your website secure, updated, and ranking high on search engines with our ongoing support and SEO services.',
    features: [
      'Regular Updates & Backup',
      'Bug Fixing & Security Monitoring',
      'On-Page & Off-Page SEO',
      'Performance Optimization',
      'Monthly Reports'
    ],
    color: '#f59e0b',
    popular: false
  }
];

const getPlanIcon = (id) => {
  switch (id) {
    case 'business':
      return <FiMonitor size={22} />;
    case 'ecommerce':
      return <FiShoppingCart size={22} />;
    case 'landing':
      return <FiTarget size={22} />;
    case 'maintenance':
      return <FiRefreshCw size={22} />;
    default:
      return <FiZap size={22} />;
  }
};

// Razorpay script loader
const loadRazorpayScript = () =>
  new Promise(resolve => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function Pricing() {
  const { currency, country, loading: currencyLoading, formatPrice } = useCurrency();
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: '', email: '' });
  const [loadingGateway, setLoadingGateway] = useState(null);

  const isIndia = country === 'IN';

  useEffect(() => {
    api.get('/plans')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setPlans(res.data);
        } else {
          setPlans(defaultPlans);
        }
        setLoadingPlans(false);
      })
      .catch(() => {
        setPlans(defaultPlans);
        setLoadingPlans(false);
      });
  }, []);

  // Get display price based on detected country
  const getDisplayPrice = (plan) => {
    if (country === 'IN') {
      return `₹${plan.priceINR.toLocaleString('en-IN')}`;
    }
    return formatPrice(plan.priceUSD);
  };

  const openModal = (plan) => {
    setModal(plan);
    setForm({ name: '', email: '' });
  };

  const closeModal = () => {
    setModal(null);
    setLoadingGateway(null);
  };

  // Razorpay (India)
  const handleRazorpay = async () => {
    if (!form.name || !form.email) return toast.error('Please fill name and email');
    setLoadingGateway('razorpay');
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Razorpay SDK failed to load');
      const res = await api.post('/payments/razorpay/create-order', {
        plan: modal.id, name: form.name, email: form.email
      });
      const { orderId, amount, currency: cur, keyId } = res.data;
      const options = {
        key: keyId, amount, currency: cur,
        name: 'DevSphere Global',
        description: modal.name,
        order_id: orderId,
        prefill: { name: form.name, email: form.email },
        theme: { color: '#6366f1' },
        handler: async (response) => {
          try {
            await api.post('/payments/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            toast.success('Payment successful! 🎉');
            closeModal();
            window.location.href = '/payment/success?direct=1';
          } catch { toast.error('Verification failed'); }
        },
        modal: { ondismiss: () => setLoadingGateway(null) }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(response.error.description || 'Payment failed');
        setLoadingGateway(null);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setLoadingGateway(null);
    }
  };

  // PayPal (International)
  const handlePayPal = async () => {
    if (!form.name || !form.email) return toast.error('Please fill name and email');
    setLoadingGateway('paypal');
    try {
      const res = await api.post('/paypal/create-order', {
        plan: modal.id, name: form.name, email: form.email
      });
      if (res.data.approveUrl) {
        window.location.href = res.data.approveUrl;
      } else throw new Error('PayPal URL not received');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setLoadingGateway(null);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container section">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title">Pricing Plans</h1>
          <p className="section-subtitle">
            Transparent, fixed pricing with no hidden charges. Pay securely via UPI, Cards, NetBanking, or PayPal.
          </p>
        </motion.div>

        {/* Currency detected badge */}
        {!currencyLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 20px', borderRadius: '50px',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
              fontSize: '0.85rem', color: 'var(--text2)'
            }}>
              <FiGlobe size={14} style={{ color: 'var(--accent)' }} />
              Prices shown in <strong style={{ color: 'var(--accent)', marginLeft: 4 }}>
                {currency.code} ({currency.symbol})
              </strong>
              &nbsp;— detected from your location
            </div>
          </motion.div>
        )}

        {/* Payment badges */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { icon: <SiRazorpay size={18} />, label: 'Razorpay', sub: 'UPI · Cards · NetBanking (India)', color: '#2d81f7' },
              { icon: <SiPaypal size={18} />, label: 'PayPal', sub: 'International · Cards · Multi-Currency', color: '#003087' }
            ].map((g, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', borderRadius: '50px', background: 'var(--card)', border: '1px solid var(--border)' }}>
                <span style={{ color: g.color }}>{g.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{g.label}</div>
                  <div style={{ color: 'var(--text2)', fontSize: '0.75rem' }}>{g.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <PaymentBadges showText={true} align="center" />
        </div>

        {/* Plans */}
        {loadingPlans ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="pricing-grid">
            {plans.map((plan, i) => {
              const cardColor = plan.color || '#3b82f6';
              const isPopular = plan.popular;
              const billing = plan.billingType || (plan.id === 'maintenance' ? 'Monthly' : 'One Time');

              return (
                <motion.div key={plan.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    background: 'var(--card)',
                    border: `1.5px solid ${isPopular ? cardColor : 'var(--border)'}`,
                    borderRadius: '22px',
                    padding: 'clamp(24px, 3vw, 32px)',
                    position: 'relative',
                    boxShadow: isPopular ? `0 20px 50px ${cardColor}25` : '0 10px 30px rgba(0,0,0,0.2)',
                    transition: 'var(--transition)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Top Bar: Icon & Popular Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: '12px',
                      background: `${cardColor}15`,
                      border: `1px solid ${cardColor}30`,
                      color: cardColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {getPlanIcon(plan.id)}
                    </div>

                    {isPopular && (
                      <div style={{
                        background: `linear-gradient(135deg, ${cardColor}, #8b5cf6)`,
                        color: 'white',
                        padding: '5px 14px',
                        borderRadius: '50px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: `0 4px 14px ${cardColor}40`
                      }}>
                        👑 Most Popular
                      </div>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text)' }}>
                    {plan.name}
                  </h3>

                  <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.5, minHeight: '40px' }}>
                    {plan.desc}
                  </p>

                  {/* Feature Checklist */}
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', flex: 1, padding: 0 }}>
                    {(plan.features || []).map((f, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', color: 'var(--text)' }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%',
                          background: `${cardColor}18`,
                          border: `1px solid ${cardColor}40`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <FiCheck size={10} style={{ color: cardColor }} />
                        </div>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Price Block with "Starting from" & Billing Type */}
                  <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)', marginBottom: '18px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Starting from
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>
                        {currencyLoading ? '...' : getDisplayPrice(plan)}
                      </span>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 600,
                        padding: '3px 9px', borderRadius: '50px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'var(--text2)'
                      }}>
                        {billing}
                      </span>
                    </div>

                    {/* Secondary approximate USD display */}
                    {!currencyLoading && country === 'IN' && (
                      <div style={{ color: 'var(--text2)', fontSize: '0.78rem', marginTop: '4px' }}>
                        ≈ ${plan.priceUSD} USD {billing === 'Monthly' ? '/ month' : ''}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => openModal(plan)}
                    className="btn"
                    style={{
                      width: '100%', justifyContent: 'center',
                      background: isPopular ? `linear-gradient(135deg, ${cardColor}, #8b5cf6)` : 'transparent',
                      color: isPopular ? 'white' : 'var(--text)',
                      border: `1.5px solid ${isPopular ? 'transparent' : 'var(--border)'}`,
                      boxShadow: isPopular ? `0 6px 20px ${cardColor}40` : 'none',
                      fontWeight: 700,
                      padding: '12px'
                    }}
                  >
                    Get Started
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.88rem', marginTop: '40px' }}>
          Need a custom enterprise solution or custom quote?{' '}
          <Link to="/contact" style={{ color: 'var(--accent)', fontWeight: 600 }}>Contact us</Link>
        </p>
      </div>


      {/* Payment Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeModal}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: 'clamp(20px, 4vw, 36px)', width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto' }}
            >
              {/* Plan summary */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Selected Plan</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{modal.name}</div>
                <div style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '4px' }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                    {getDisplayPrice(modal)}
                  </span>
                  {country !== 'IN' && currency.code !== 'USD' && (
                    <span style={{ marginLeft: '8px', fontSize: '0.82rem' }}>≈ ${modal.priceUSD} USD</span>
                  )}
                  {country === 'IN' && (
                    <span style={{ marginLeft: '8px', fontSize: '0.82rem' }}>≈ ${modal.priceUSD} USD</span>
                  )}
                </div>
              </div>

              {/* Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }} />
                  <input placeholder="Your Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ paddingLeft: '42px' }} />
                </div>
                <div style={{ position: 'relative' }}>
                  <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }} />
                  <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ paddingLeft: '42px' }} />
                </div>
              </div>

              {/* Payment buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text2)', textAlign: 'center', marginBottom: '4px' }}>
                  Choose payment method
                </p>

                {/* Razorpay - show for India */}
                {isIndia && (
                  <button onClick={handleRazorpay} disabled={!!loadingGateway}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '12px', border: 'none', background: loadingGateway === 'razorpay' ? '#1a6fd4' : '#2d81f7', color: 'white', fontWeight: 600, fontSize: '0.95rem', cursor: loadingGateway ? 'not-allowed' : 'pointer', opacity: loadingGateway && loadingGateway !== 'razorpay' ? 0.5 : 1 }}>
                    <SiRazorpay size={20} />
                    {loadingGateway === 'razorpay' ? 'Opening...' : `Pay ₹${modal.priceINR.toLocaleString('en-IN')} via Razorpay`}
                  </button>
                )}

                {isIndia && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                    <span style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>or pay international</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  </div>
                )}

                {/* PayPal - always show */}
                <button onClick={handlePayPal} disabled={!!loadingGateway}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', borderRadius: '12px', border: 'none', background: loadingGateway === 'paypal' ? '#002570' : '#003087', color: 'white', fontWeight: 600, fontSize: '0.95rem', cursor: loadingGateway ? 'not-allowed' : 'pointer', opacity: loadingGateway && loadingGateway !== 'paypal' ? 0.5 : 1 }}>
                  <SiPaypal size={20} />
                  {loadingGateway === 'paypal' ? 'Redirecting...' : `Pay $${modal.priceUSD} via PayPal`}
                </button>
              </div>

              <div style={{ marginTop: '16px' }}>
                <PaymentBadges showText={true} align="center" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @media (max-width: 768px) { .pricing-grid { grid-template-columns: 1fr !important; } }
        @media (min-width: 769px) and (max-width: 1200px) { .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </div>
  );
}
