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
    <div className="page-wrapper" style={{ paddingTop: 'calc(var(--nav-height) + 10px)' }}>
      <div className="container" style={{ paddingBottom: '40px' }}>

        {/* Compact Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div className="section-tag" style={{ marginBottom: '8px', padding: '4px 14px', fontSize: '0.72rem' }}>
            Transparent Pricing
          </div>
          <h1 className="section-title" style={{ fontSize: 'clamp(1.7rem, 2.5vw, 2.2rem)', marginBottom: '6px' }}>
            Pricing Plans
          </h1>
          <p className="section-subtitle" style={{ fontSize: '0.88rem', margin: '0 auto 12px', maxWidth: '580px', lineHeight: 1.45 }}>
            Transparent, fixed pricing with no hidden charges. Pay securely via UPI, Cards, NetBanking, or PayPal.
          </p>
        </motion.div>

        {/* Compact Bar: Currency + Gateways */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '22px'
        }}>
          {!currencyLoading && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '5px 14px', borderRadius: '50px',
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)',
              fontSize: '0.76rem', color: 'var(--text2)'
            }}>
              <FiGlobe size={12} style={{ color: 'var(--accent)' }} />
              <span>Prices in <strong style={{ color: 'var(--accent)' }}>{currency.code} ({currency.symbol})</strong></span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '50px', background: 'var(--card)', border: '1px solid var(--border)', fontSize: '0.74rem' }}>
              <span style={{ color: '#2d81f7', display: 'flex' }}><SiRazorpay size={13} /></span>
              <span style={{ fontWeight: 600 }}>Razorpay</span>
              <span style={{ color: 'var(--text3)', fontSize: '0.68rem' }}>(UPI / Cards / NetBanking)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '50px', background: 'var(--card)', border: '1px solid var(--border)', fontSize: '0.74rem' }}>
              <span style={{ color: '#0079C1', display: 'flex' }}><SiPaypal size={13} /></span>
              <span style={{ fontWeight: 600 }}>PayPal</span>
              <span style={{ color: 'var(--text3)', fontSize: '0.68rem' }}>(International / USD)</span>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        {loadingPlans ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    background: 'var(--card)',
                    border: `1.5px solid ${isPopular ? cardColor : 'var(--border)'}`,
                    borderRadius: '16px',
                    padding: '18px 16px 16px',
                    position: 'relative',
                    boxShadow: isPopular ? `0 12px 35px ${cardColor}25` : '0 6px 20px rgba(0,0,0,0.25)',
                    transition: 'var(--transition)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Top section */}
                  <div>
                    {/* Top Bar: Icon & Popular Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '10px',
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
                          padding: '3px 10px',
                          borderRadius: '50px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: `0 3px 10px ${cardColor}35`
                        }}>
                          👑 Most Popular
                        </div>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.08rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text)', lineHeight: 1.25 }}>
                      {plan.name}
                    </h3>

                    <p style={{ color: 'var(--text2)', fontSize: '0.78rem', marginBottom: '12px', lineHeight: 1.35, minHeight: '32px' }}>
                      {plan.desc}
                    </p>

                    {/* Feature Checklist */}
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', padding: 0 }}>
                      {(plan.features || []).map((f, j) => (
                        <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.79rem', color: 'var(--text)', lineHeight: 1.3 }}>
                          <div style={{
                            width: 15, height: 15, borderRadius: '50%',
                            background: `${cardColor}18`,
                            border: `1px solid ${cardColor}40`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <FiCheck size={9} style={{ color: cardColor }} />
                          </div>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price Block with "Starting from" & Billing Type */}
                  <div style={{ marginTop: 'auto' }}>
                    <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border)', marginBottom: '10px' }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                        Starting from
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                          {currencyLoading ? '...' : getDisplayPrice(plan)}
                        </span>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 600,
                          padding: '2px 7px', borderRadius: '50px',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'var(--text2)'
                        }}>
                          {billing}
                        </span>
                      </div>

                      {/* Secondary approximate USD display */}
                      {!currencyLoading && country === 'IN' && (
                        <div style={{ color: 'var(--text3)', fontSize: '0.72rem', marginTop: '2px' }}>
                          ≈ ${plan.priceUSD} USD {billing === 'Monthly' ? '/ mo' : ''}
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
                        boxShadow: isPopular ? `0 4px 14px ${cardColor}35` : 'none',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        padding: '9px 12px',
                        borderRadius: '10px'
                      }}
                    >
                      Get Started
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.82rem', marginTop: '24px' }}>
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
