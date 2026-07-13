import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiArrowRight, FiCheck, FiFolder, FiCpu, 
  FiLayers, FiSettings, FiCheckCircle, FiUser, FiMail, 
  FiMessageSquare, FiTrendingUp, FiZap 
} from 'react-icons/fi';
import { useCurrency } from '../hooks/useCurrency';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const steps = [
  { id: 1, name: 'Project Type', icon: <FiFolder /> },
  { id: 2, name: 'Scale & Pages', icon: <FiLayers /> },
  { id: 3, name: 'Core Features', icon: <FiCpu /> },
  { id: 4, name: 'Design & Speed', icon: <FiSettings /> },
  { id: 5, name: 'Get Custom Quote', icon: <FiCheckCircle /> }
];

const projectTypes = [
  { id: 'landing', title: 'Landing Page', desc: 'Single-page website optimized for conversions and product marketing.', basePriceUSD: 250, details: 'Includes hero, features, testimonials, contact form' },
  { id: 'corporate', title: 'Business Website', desc: 'Multi-page corporate site to establish high trust and brand presence.', basePriceUSD: 500, details: 'Includes up to 8 pages, basic SEO, contact form' },
  { id: 'ecommerce', title: 'E-commerce Store', desc: 'Online store with inventory management, cart, and payment gateway.', basePriceUSD: 850, details: 'Product management, cart system, checkout flow' },
  { id: 'webapp', title: 'Custom Web Application', desc: 'SaaS product, portal, dashboard, or database-driven custom app.', basePriceUSD: 1300, details: 'Complex database logic, custom dashboard features' }
];

const pageScales = [
  { label: '1 - 3 Pages', priceUSD: 0, desc: 'Ideal for simple landing pages or minimal portfolios' },
  { label: '4 - 8 Pages', priceUSD: 100, desc: 'Standard business size website layout' },
  { label: '9 - 15 Pages', priceUSD: 250, desc: 'Large site structure with blog and services' },
  { label: '15+ Pages', priceUSD: 450, desc: 'Heavy content or large directory websites' }
];

const featureAddons = [
  { id: 'cms', title: 'Content Management System (CMS)', desc: 'Easily edit text and images yourself without writing code.', priceUSD: 150 },
  { id: 'auth', title: 'User Login & Profiles', desc: 'Allow visitors to register accounts, login, and access dashboards.', priceUSD: 200 },
  { id: 'payment', title: 'Payment Gateways Integration', desc: 'Stripe, PayPal, or Razorpay configured for online checkouts.', priceUSD: 150 },
  { id: 'search', title: 'Advanced Search & Filters', desc: 'Instant search bar with custom filters and categories.', priceUSD: 100 },
  { id: 'animations', title: 'Premium Custom Animations', desc: 'Wow visitors with advanced Framer Motion transitions and effects.', priceUSD: 150 }
];

const designLevels = [
  { id: 'standard', title: 'Standard Responsive Design', desc: 'Clean, modern website built on professional layout guidelines.', priceUSD: 0 },
  { id: 'bespoke', title: 'Premium Bespoke UI / UX', desc: 'Custom, pixel-perfect layouts designed from scratch for your brand.', priceUSD: 200 }
];

const speedLevels = [
  { id: 'standard', title: 'Standard Speed', desc: 'Delivered in normal estimated timeline.', priceUSD: 0 },
  { id: 'rush', title: 'Rush Delivery', desc: 'Priority development to launch the product 40% faster.', priceUSD: 150 }
];

const slideTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.25, ease: 'easeIn' } }
};

export default function CostEstimator() {
  const { currency, loading: currencyLoading, convert } = useCurrency();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState('landing');
  const [selectedScale, setSelectedScale] = useState(0); // Index of pageScales
  const [selectedFeatures, setSelectedFeatures] = useState([]); // Array of feature IDs
  const [designLevel, setDesignLevel] = useState('standard');
  const [speedLevel, setSpeedLevel] = useState('standard');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Total calculation logic
  const calculateTotalUSD = () => {
    let total = 0;
    // Base Project Type
    const baseObj = projectTypes.find(t => t.id === selectedType);
    if (baseObj) total += baseObj.basePriceUSD;
    // Page count
    total += pageScales[selectedScale].priceUSD;
    // Features
    selectedFeatures.forEach(fid => {
      const feat = featureAddons.find(f => f.id === fid);
      if (feat) total += feat.priceUSD;
    });
    // Design Level
    const dl = designLevels.find(d => d.id === designLevel);
    if (dl) total += dl.priceUSD;
    // Speed Level
    const sl = speedLevels.find(s => s.id === speedLevel);
    if (sl) total += sl.priceUSD;

    return total;
  };

  const totalUSD = calculateTotalUSD();

  const handleFeatureToggle = (id) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) {
      return toast.error('Please enter your name and email');
    }
    setSubmitLoading(true);

    // Build estimation summary message
    const baseObj = projectTypes.find(t => t.id === selectedType);
    const selectedFeatsText = selectedFeatures.map(fid => {
      const feat = featureAddons.find(f => f.id === fid);
      return feat ? ` - ${feat.title}` : '';
    }).filter(Boolean).join('\n');

    const summaryText = `[Project Estimator Submission]
Project Type: ${baseObj ? baseObj.title : selectedType}
Pages Scope: ${pageScales[selectedScale].label}
Design Style: ${designLevel === 'bespoke' ? 'Bespoke UI/UX' : 'Standard'}
Timeline: ${speedLevel === 'rush' ? 'Rush Delivery' : 'Standard Timeline'}
Estimated Budget: $${totalUSD} USD (${currencyLoading ? '...' : convert(totalUSD)})

Selected Add-ons:\n${selectedFeatsText || 'None'}

Client Note: ${contactForm.message || 'No additional message.'}`;

    try {
      await api.post('/contact', {
        name: contactForm.name,
        email: contactForm.email,
        subject: `Cost Estimate Inquiry: ${baseObj ? baseObj.title : 'New Project'}`,
        message: summaryText
      });
      toast.success('Inquiry submitted successfully! 🎉');
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit estimate. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.06), transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ paddingBottom: '60px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge" style={{ display: 'inline-flex', gap: '6px', alignItems: 'center', marginBottom: '12px' }}>
            <FiTrendingUp size={13} style={{ color: 'var(--accent)' }} /> Cost Calculator
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, marginBottom: '10px' }}>
            Project <span className="gradient-text">Cost Estimator</span>
          </h1>
          <p style={{ color: 'var(--text2)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
            Estimate your project budget instantly based on your requirements and submit a request to get started.
          </p>
        </div>

        {/* Steps Tracker */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {steps.map(s => {
            const isActive = currentStep === s.id;
            const isCompleted = currentStep > s.id;
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '10px 16px', borderRadius: '50px',
                  background: isActive ? 'rgba(99,102,241,0.1)' : 'var(--card)',
                  border: isActive ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                  color: isActive ? 'var(--accent)' : isCompleted ? '#10b981' : 'var(--text2)',
                  fontSize: '0.85rem', fontWeight: 600, transition: 'var(--transition)'
                }}>
                  {isCompleted ? <FiCheck size={14} /> : s.icon}
                  <span>{s.name}</span>
                </div>
                {s.id < 5 && (
                  <div style={{ width: '20px', height: '1.5px', background: isCompleted ? '#10b981' : 'var(--border)', opacity: 0.6 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Interface Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '32px', alignItems: 'start', maxWidth: '1120px', margin: '0 auto' }}>
          
          {/* Left Panel: Step Form */}
          <div className="card" style={{ padding: '36px', minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
            {success ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontSize: '2.2rem', marginBottom: '24px' }}>
                  <FiCheck />
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '12px' }}>Thank You!</h2>
                <p style={{ color: 'var(--text2)', maxWidth: '440px', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '28px' }}>
                  Your project estimate and details have been successfully submitted. I will review your requirements and reach out to you within 24 hours.
                </p>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <button onClick={() => { setSuccess(false); setCurrentStep(1); setSelectedFeatures([]); setSelectedScale(0); }} className="btn btn-primary">
                    New Estimate
                  </button>
                  <Link to="/" className="btn btn-outline">Go to Homepage</Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1 }}>
                
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div key="step1" {...slideTransition}>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px' }}>Select Project Type</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {projectTypes.map(t => (
                          <div 
                            key={t.id} 
                            onClick={() => setSelectedType(t.id)}
                            style={{
                              padding: '24px', borderRadius: '16px', background: 'var(--bg2)',
                              border: selectedType === t.id ? '2px solid var(--accent)' : '2.5px solid transparent',
                              cursor: 'pointer', transition: 'var(--transition)', position: 'relative',
                              boxShadow: selectedType === t.id ? '0 10px 30px rgba(99,102,241,0.06)' : 'none'
                            }}
                          >
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', color: selectedType === t.id ? 'var(--accent)' : 'var(--text)' }}>
                              {t.title}
                            </h3>
                            <p style={{ color: 'var(--text2)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '14px' }}>{t.desc}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 500 }}>{t.details}</span>
                              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text)' }}>
                                {currencyLoading ? '...' : convert(t.basePriceUSD)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div key="step2" {...slideTransition}>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Select Website Pages / Scope</h2>
                      <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: '28px' }}>
                        Select the approximate number of pages needed for your content structure.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {pageScales.map((scale, index) => (
                          <div 
                            key={index}
                            onClick={() => setSelectedScale(index)}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '20px 24px', borderRadius: '14px', background: 'var(--bg2)',
                              border: selectedScale === index ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                              cursor: 'pointer', transition: 'var(--transition)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                              <div style={{
                                width: 22, height: 22, borderRadius: '50%',
                                border: '2px solid', borderColor: selectedScale === index ? 'var(--accent)' : 'var(--text3)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                              }}>
                                {selectedScale === index && (
                                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)' }} />
                                )}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{scale.label}</div>
                                <div style={{ color: 'var(--text2)', fontSize: '0.8rem', marginTop: '2px' }}>{scale.desc}</div>
                              </div>
                            </div>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: selectedScale === index ? 'var(--accent)' : 'var(--text2)' }}>
                              {scale.priceUSD === 0 ? 'Included' : `+ ${currencyLoading ? '...' : convert(scale.priceUSD)}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div key="step3" {...slideTransition}>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Additional Features</h2>
                      <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: '24px' }}>
                        Choose specific extensions or custom functionalities you want to integrate.
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {featureAddons.map(feat => {
                          const isSel = selectedFeatures.includes(feat.id);
                          return (
                            <div 
                              key={feat.id} 
                              onClick={() => handleFeatureToggle(feat.id)}
                              style={{
                                padding: '20px', borderRadius: '14px', background: 'var(--bg2)',
                                border: isSel ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                                cursor: 'pointer', transition: 'var(--transition)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                              }}
                            >
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: isSel ? 'var(--accent)' : 'var(--text)', marginRight: 10 }}>{feat.title}</h3>
                                  <div style={{
                                    width: 18, height: 18, borderRadius: 4,
                                    border: '1.5px solid', borderColor: isSel ? 'var(--accent)' : 'var(--text3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    background: isSel ? 'var(--accent)' : 'transparent'
                                  }}>
                                    {isSel && <FiCheck size={12} style={{ color: 'white' }} />}
                                  </div>
                                </div>
                                <p style={{ color: 'var(--text2)', fontSize: '0.78rem', lineHeight: 1.5, marginBottom: '14px' }}>{feat.desc}</p>
                              </div>
                              <span style={{ fontWeight: 800, fontSize: '0.92rem', alignSelf: 'flex-end' }}>
                                + {currencyLoading ? '...' : convert(feat.priceUSD)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 4 && (
                    <motion.div key="step4" {...slideTransition}>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px' }}>Design & Timeline Speed</h2>
                      
                      <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', marginBottom: '12px' }}>Design Style</label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          {designLevels.map(d => (
                            <div key={d.id} onClick={() => setDesignLevel(d.id)}
                              style={{
                                flex: 1, padding: '18px 20px', borderRadius: '12px', background: 'var(--bg2)',
                                border: designLevel === d.id ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                                cursor: 'pointer', transition: 'var(--transition)'
                              }}>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{d.title}</div>
                              <div style={{ color: 'var(--text2)', fontSize: '0.76rem', marginBottom: '10px' }}>{d.desc}</div>
                              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                                {d.priceUSD === 0 ? 'Included' : `+ ${currencyLoading ? '...' : convert(d.priceUSD)}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: 700, fontSize: '0.95rem', marginBottom: '12px' }}>Timeline Speed</label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          {speedLevels.map(s => (
                            <div key={s.id} onClick={() => setSpeedLevel(s.id)}
                              style={{
                                flex: 1, padding: '18px 20px', borderRadius: '12px', background: 'var(--bg2)',
                                border: speedLevel === s.id ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                                cursor: 'pointer', transition: 'var(--transition)'
                              }}>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{s.title}</div>
                              <div style={{ color: 'var(--text2)', fontSize: '0.76rem', marginBottom: '10px' }}>{s.desc}</div>
                              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                                {s.priceUSD === 0 ? 'Included' : `+ ${currencyLoading ? '...' : convert(s.priceUSD)}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 5 && (
                    <motion.div key="step5" {...slideTransition}>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Get Your Custom Proposal</h2>
                      <p style={{ color: 'var(--text3)', fontSize: '0.85rem', marginBottom: '24px' }}>
                        Provide your contact details, and I will prepare a detailed proposal representing this configuration.
                      </p>
                      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                          <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }} />
                          <input name="name" value={contactForm.name} onChange={handleContactChange} placeholder="Your Name *" required style={{ paddingLeft: '42px' }} />
                        </div>
                        <div style={{ position: 'relative' }}>
                          <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text2)' }} />
                          <input name="email" type="email" value={contactForm.email} onChange={handleContactChange} placeholder="Email Address *" required style={{ paddingLeft: '42px' }} />
                        </div>
                        <div style={{ position: 'relative' }}>
                          <FiMessageSquare style={{ position: 'absolute', left: 14, top: '24px', color: 'var(--text2)' }} />
                          <textarea name="message" value={contactForm.message} onChange={handleContactChange} placeholder="Tell me more about your requirements (optional)..." rows={4} style={{ paddingLeft: '42px', paddingTop: '14px', resize: 'vertical' }} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={submitLoading} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.95rem' }}>
                          {submitLoading ? 'Submitting request...' : 'Request Custom Proposal'}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer buttons inside left panel */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1.5px solid var(--border)', marginTop: 'auto', paddingTop: '24px' }}>
                  <button 
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="btn btn-outline"
                    style={{ padding: '10px 18px', opacity: currentStep === 1 ? 0.3 : 1, cursor: currentStep === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    <FiArrowLeft style={{ marginRight: 6 }} /> Previous
                  </button>
                  {currentStep < 5 && (
                    <button 
                      onClick={handleNext}
                      className="btn btn-primary"
                      style={{ padding: '10px 22px' }}
                    >
                      Next Step <FiArrowRight style={{ marginLeft: 6 }} />
                    </button>
                  )}
                </div>

              </div>
            )}
          </div>

          {/* Right Panel: Live Estimate Summary */}
          <div className="card" style={{ padding: '28px', borderTop: '3px solid var(--accent)', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiZap style={{ color: 'var(--accent)' }} /> Live Estimate
            </h3>

            {/* Price section */}
            <div style={{ background: 'var(--bg2)', borderRadius: '12px', padding: '18px', marginBottom: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Estimated Budget</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
                {currencyLoading ? '...' : convert(totalUSD)}
              </div>
              {currency.code !== 'USD' && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text2)', marginTop: '2px' }}>
                  ≈ ${totalUSD} USD
                </div>
              )}
            </div>

            {/* Selection list */}
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>Configuration Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Project type */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text2)' }}>
                    Type: <strong style={{ color: 'var(--text)' }}>
                      {projectTypes.find(t => t.id === selectedType)?.title}
                    </strong>
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {currencyLoading ? '...' : convert(projectTypes.find(t => t.id === selectedType)?.basePriceUSD)}
                  </span>
                </div>

                {/* Pages scale */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text2)' }}>
                    Pages: <strong style={{ color: 'var(--text)' }}>{pageScales[selectedScale].label}</strong>
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {pageScales[selectedScale].priceUSD === 0 ? 'Included' : `+ ${currencyLoading ? '...' : convert(pageScales[selectedScale].priceUSD)}`}
                  </span>
                </div>

                {/* Design Level */}
                {designLevel === 'bespoke' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text2)' }}>Design: <strong style={{ color: 'var(--text)' }}>Bespoke UI/UX</strong></span>
                    <span style={{ fontWeight: 600 }}>+ {currencyLoading ? '...' : convert(200)}</span>
                  </div>
                )}

                {/* Rush Speed */}
                {speedLevel === 'rush' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: 'var(--text2)' }}>Speed: <strong style={{ color: 'var(--text)' }}>Rush Delivery</strong></span>
                    <span style={{ fontWeight: 600 }}>+ {currencyLoading ? '...' : convert(150)}</span>
                  </div>
                )}

                {/* Features */}
                {selectedFeatures.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text3)', fontWeight: 600, marginBottom: '8px' }}>Add-on Features:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedFeatures.map(fid => {
                        const feat = featureAddons.find(f => f.id === fid);
                        return feat ? (
                          <div key={fid} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                            <span style={{ color: 'var(--text2)', maxWidth: '170px' }}>{feat.title}</span>
                            <span style={{ fontWeight: 600, flexShrink: 0 }}>
                              + {currencyLoading ? '...' : convert(feat.priceUSD)}
                            </span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: '20px', paddingTop: '16px', fontSize: '0.75rem', color: 'var(--text3)', lineHeight: 1.5 }}>
              * This is an automated preliminary estimate. Final proposals may vary slightly depending on detailed feature specifications.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
