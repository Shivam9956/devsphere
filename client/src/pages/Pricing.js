import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiZap, FiUser, FiMail, FiGlobe } from 'react-icons/fi';
import { SiRazorpay, SiPaypal } from 'react-icons/si';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCurrency } from '../hooks/useCurrency';

const defaultPlans = [
  {
    id: 'landing',
    name: 'Landing Page',
    priceUSD: 99,
    priceINR: 8000,
    delivery: '3-5 days',
    desc: 'High-converting single-page website for ads and lead generation.',
    features: [
      '1 Premium landing page',
      'High-converting layout design',
      'Best for Coaching, SaaS & Real Estate',
      'WhatsApp & CRM contact integration',
      '15 days free support & bug fixes',
      'Fast delivery (3-5 days)'
    ],
    color: '#06b6d4',
    popular: false
  },
  {
    id: 'business',
    name: 'Business Website',
    priceUSD: 189,
    priceINR: 15000,
    delivery: '7-10 days',
    desc: 'Complete multi-page professional website for your business.',
    features: [
      'Up to 8 custom responsive pages',
      'Ideal for Gyms, Restaurants, Schools & Hospitals',
      'Real Estate & Travel Agency features',
      'Basic SEO optimization & Google Maps',
      'Inquiry form & Lead capture',
      '1 month developer support'
    ],
    color: '#6366f1',
    popular: true
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    priceUSD: 429,
    priceINR: 35000,
    delivery: '2-3 weeks',
    desc: 'Fully-featured online store with payment and product management.',
    features: [
      'Unlimited product listings',
      'Clothing, Electronics, Grocery stores',
      'Secure payment gateways (Stripe, UPI)',
      'Inventory & Order dashboard',
      'Automated invoice generator',
      '3 months priority support'
    ],
    color: '#8b5cf6',
    popular: false
  },
  {
    id: 'maintenance',
    name: 'Maintenance & SEO',
    priceUSD: 65,
    priceINR: 5000,
    delivery: 'Monthly',
    desc: 'Keep your website fast, updated, secure and high-ranking.',
    features: [
      'Unlimited content updates & bug fixes',
      'Daily database backups & security scans',
      'Performance optimization & speed tuning',
      'Monthly SEO audit & keyword tracking',
      'Priority developer support'
    ],
    color: '#10b981',
    popular: false
  }
];

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
      new window.Razorpay(options).open();
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
      const res = await api.post('/payments/paypal/create-order', {
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
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container section">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title">Pricing Plans</h1>
          <p className="section-subtitle">
            Transparent pricing. Pay securely via Razorpay (India) or PayPal (International).
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
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '48px', flexWrap: 'wrap' }}>
          {[
            { icon: <SiRazorpay size={18} />, label: 'Razorpay', sub: 'UPI · Cards · NetBanking (India)', color: '#2d81f7' },
            { icon: <SiPaypal size={18} />, label: 'PayPal', sub: 'International · Cards', color: '#003087' }
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

        {/* Plans */}
        {loadingPlans ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner" />
          </div>
        ) : (
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', maxWidth: '1200px', margin: '0 auto 40px', alignItems: 'stretch' }}>
            {plans.map((plan, i) => (
            <motion.div key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'var(--card)',
                border: `1.5px solid ${plan.popular ? plan.color : 'var(--border)'}`,
                borderRadius: '22px',
                padding: '36px 32px',
                position: 'relative',
                boxShadow: plan.popular ? `0 20px 60px ${plan.color}20` : 'none',
                transition: 'var(--transition)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: plan.color, color: 'white', padding: '4px 16px',
                  borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap'
                }}>
                  <FiZap size={12} /> Most Popular
                </div>
              )}

              <div style={{ color: plan.color, fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {plan.name}
              </div>

              {/* Main price in local currency */}
              <div style={{ marginBottom: '4px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800 }}>
                  {currencyLoading ? '...' : getDisplayPrice(plan)}
                </span>
              </div>

              {/* Secondary price in USD (if not already USD) */}
              {!currencyLoading && country !== 'IN' && currency.code !== 'USD' && (
                <div style={{ color: 'var(--text2)', fontSize: '0.82rem', marginBottom: '8px' }}>
                  ≈ ${plan.priceUSD} USD
                </div>
              )}
              {!currencyLoading && country === 'IN' && (
                <div style={{ color: 'var(--text2)', fontSize: '0.82rem', marginBottom: '8px' }}>
                  ≈ ${plan.priceUSD} USD
                </div>
              )}

              <p style={{ color: 'var(--text2)', fontSize: '0.88rem', marginBottom: '12px', lineHeight: 1.5 }}>{plan.desc}</p>
              {plan.delivery && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '50px', background: `${plan.color}12`, color: plan.color, fontSize: '0.75rem', fontWeight: 600, marginBottom: '20px' }}>
                  ⚡ Delivery: {plan.delivery}
                </div>
              )}

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px', marginBottom: '28px', flex: 1 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: 'var(--text2)' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${plan.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FiCheck size={11} style={{ color: plan.color }} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openModal(plan)}
                className="btn"
                style={{
                  width: '100%', justifyContent: 'center',
                  background: plan.popular ? `linear-gradient(135deg, ${plan.color}, #06b6d4)` : 'transparent',
                  color: plan.popular ? 'white' : 'var(--text)',
                  border: `1.5px solid ${plan.popular ? 'transparent' : 'var(--border)'}`,
                  boxShadow: plan.popular ? `0 4px 20px ${plan.color}35` : 'none',
                  fontWeight: 600
                }}
              >
                Get Started
              </button>
            </motion.div>
          ))}
          </div>
        )}

        <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.88rem' }}>
          Need a custom quote?{' '}
          <Link to="/contact" style={{ color: 'var(--accent)' }}>Contact us</Link>
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
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '440px' }}
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

              <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.78rem', marginTop: '16px' }}>
                🔒 Secure & encrypted payment. No card details stored.
              </p>
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
