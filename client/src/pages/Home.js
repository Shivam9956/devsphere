import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { FiArrowRight, FiDownload, FiCode, FiLayout, FiDatabase, FiSmartphone, FiZap, FiHeadphones, FiMail, FiMapPin, FiSend, FiClock, FiCheck, FiStar, FiShoppingCart, FiTarget, FiRefreshCw } from 'react-icons/fi';
import { getIcon } from '../utils/iconMap';
import { FaReact, FaNodeJs, FaWhatsapp } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiJavascript, SiTypescript, SiPython } from 'react-icons/si';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAudit } from '../App';
import ProjectCard from '../components/ProjectCard';
import TestimonialCard from '../components/TestimonialCard';
import TestimonialForm from '../components/TestimonialForm';
import AnimatedCodeBlock from '../components/AnimatedCodeBlock';
import PaymentBadges from '../components/PaymentBadges';
import Typewriter from '../components/Typewriter';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const skills = [
  { name: 'React.js', icon: <FaReact />, color: '#61dafb', level: 95, link: 'https://react.dev' },
  { name: 'Node.js', icon: <FaNodeJs />, color: '#68a063', level: 90, link: 'https://nodejs.org' },
  { name: 'MongoDB', icon: <SiMongodb />, color: '#47a248', level: 85, link: 'https://www.mongodb.com' },
  { name: 'Express.js', icon: <SiExpress />, color: 'var(--text)', level: 90, link: 'https://expressjs.com' },
  { name: 'JavaScript', icon: <SiJavascript />, color: '#f7df1e', level: 95, link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { name: 'TypeScript', icon: <SiTypescript />, color: '#3178c6', level: 80, link: 'https://www.typescriptlang.org' },
  { name: 'Python', icon: <SiPython />, color: '#3776ab', level: 75, link: 'https://www.python.org' }
];

const defaultServices = [
  { icon: <FiStar />, title: 'Business Website ⭐', desc: 'Establish a powerful presence with custom websites for Gyms, Restaurants, Schools, Hospitals, Real Estate, Manufacturing, and Travel agencies.' },
  { icon: <FiShoppingCart />, title: 'E-commerce Website', desc: 'Fully secure, premium online stores built to grow sales for Clothing, Electronics, Grocery, Cosmetics, and Furniture.' },
  { icon: <FiTarget />, title: 'Landing Page', desc: 'High-converting single pages optimized to drive leads and maximize ROI for Coaching, SaaS, Real Estate, and ads.' },
  { icon: <FiRefreshCw />, title: 'Website Maintenance & SEO', desc: 'Ensure your website stays fast, secure, and ranks high with regular updates, speed tuning, backups, and SEO.' }
];

const techIcons = [
  { icon: <FaReact />, color: '#61dafb', label: 'React', link: 'https://react.dev' },
  { icon: <FaNodeJs />, color: '#68a063', label: 'Node.js', link: 'https://nodejs.org' },
  { icon: <SiMongodb />, color: '#47a248', label: 'MongoDB', link: 'https://www.mongodb.com' },
  { icon: <SiExpress />, color: 'var(--text)', label: 'Express', link: 'https://expressjs.com' },
  { icon: <SiJavascript />, color: '#f7df1e', label: 'JavaScript', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { icon: <SiPython />, color: '#3776ab', label: 'Python', link: 'https://www.python.org' }
];

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedTestimonialFilter, setSelectedTestimonialFilter] = useState('All');
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const { openAuditModal } = useAudit();
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  const handleContactChange = e => setContactForm({ ...contactForm, [e.target.name]: e.target.value });

  const handleContactSubmit = async e => {
    e.preventDefault();
    setContactLoading(true);
    try {
      await api.post('/contact', contactForm);
      toast.success("Message sent! I'll get back to you within 24 hours.");
      setContactForm({ name: '', email: '', subject: '', message: '' });
      setContactSent(true);
      setTimeout(() => setContactSent(false), 5000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setContactLoading(false);
    }
  };

  useEffect(() => {
    api.get('/projects').then(r => setProjects(r.data.slice(0, 3))).catch(() => {});
    api.get('/testimonials').then(r => setTestimonials(r.data || [])).catch(() => {});
    api.get('/services-manage').then(r => setServices(r.data || [])).catch(() => {});
  }, []);

  return (
    <div className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb1" />
          <div className="hero-orb orb2" />
          <div className="hero-grid" />
        </div>

        <div className="container hero-content">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="hero-text">
            <motion.div variants={fadeUp}>
              <span className="badge">
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                Accepting New Projects
              </span>
            </motion.div>

            <h1 className="hero-title" style={{ display: 'block' }}>
              <span className="hero-title-line-1">
                We Build <span className="gradient-text gradient-shine">Digital</span>
              </span>
              <span className="hero-title-line-2">
                Experiences That
              </span>
              <span className="hero-title-line-3">
                <span className="gradient-text gradient-shine">Grow</span> Businesses
              </span>
            </h1>

            <motion.p variants={fadeUp} className="hero-subtitle">
              DevSphere Global helps businesses, startups, and entrepreneurs build modern, fast, and scalable websites and web applications that grow their online presence.
            </motion.p>

            <motion.div variants={fadeUp} className="hero-cta" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary">
                Get a Free Quote <FiArrowRight size={16} />
              </Link>
              <button
                type="button"
                onClick={openAuditModal}
                className="btn btn-outline"
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderColor: 'rgba(99, 102, 241, 0.35)',
                  color: 'var(--text)',
                  fontWeight: 600,
                  gap: '8px'
                }}
              >
                🎁 Free Website Audit
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="hero-tech">
              {techIcons.map((t, i) => (
                <a
                  key={i}
                  href={t.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tech-icon"
                  title={`Open ${t.label}`}
                  style={{ color: t.color, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex' }}
                >
                  {t.icon}
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Animated Code Window */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="hero-card-main" style={{ width: '100%' }}>
              <AnimatedCodeBlock />
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '16px' }}>
                <motion.div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '50px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#10b981' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                  <FiZap size={12} /> Available for New Projects
                </motion.div>
                <motion.div style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '50px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
                  🌍 Worldwide Clients (USA, UK, AU, IN)
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section ref={statsRef} className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { value: 5,  suffix: '+', label: 'Projects Completed' },
              { value: 5,  suffix: '+', label: 'Happy Clients' },
              { value: 3,  suffix: '+', label: 'Years Experience' },
              { value: 5,  suffix: '+', label: 'Countries Served' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className="stat-value">
                  {statsInView ? <CountUp end={stat.value} duration={2} /> : '0'}{stat.suffix}
                </div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="section about-section">
        <div className="container">
          <div className="about-grid">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="section-tag">About Our Agency</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '20px' }}>
                Empowering businesses with a{' '}
                <span className="gradient-text">global mindset</span>
              </h2>
              <p style={{ color: 'var(--text2)', lineHeight: 1.85, marginBottom: '16px', fontSize: '0.97rem' }}>
                We are DevSphere Global, a web development agency with a track record of building high-performance,
                scalable web applications for clients across USA, UK, Canada, and Australia.
              </p>
              <p style={{ color: 'var(--text2)', lineHeight: 1.85, marginBottom: '36px', fontSize: '0.97rem' }}>
                We specialize in React.js, Node.js, Next.js, and MongoDB — delivering clean code, modern UI/UX,
                and conversion-focused solutions that help businesses scale online.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary">Start a Project</Link>
                <Link to="/services" className="btn btn-outline">Our Services</Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 style={{ marginBottom: '28px', fontWeight: 700, fontSize: '1.1rem' }}>Technical Skills</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {skills.map((skill, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                      <a
                        href={skill.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem', color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
                        title={`Open ${skill.name} documentation`}
                      >
                        <span style={{ color: skill.color, fontSize: '1.1rem' }}>{skill.icon}</span>
                        {skill.name}
                      </a>
                      <span style={{ color: 'var(--text3)', fontSize: '0.82rem', fontWeight: 600 }}>{skill.level}%</span>
                    </div>
                    <div style={{ height: '5px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                      <motion.div
                        style={{ height: '100%', background: 'var(--gradient)', borderRadius: '3px' }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div className="section-tag" style={{ display: 'inline-flex' }}>What We Do</div>
            </div>
            <h2 className="section-title">Services We Offer</h2>
            <p className="section-subtitle">End-to-end web development solutions for your business</p>
          </motion.div>

          <div className="grid-4">
            {services.map((s, i) => (
              <motion.div
                key={i}
                className="card service-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate('/services')}
                style={{ cursor: 'pointer' }}
                title="Click to view services"
              >
                <div className="service-icon">{s.icon && typeof s.icon === 'string' ? getIcon(s.icon) : (s.icon || getIcon('FiCode'))}</div>
                <h3 style={{ marginBottom: '10px', fontWeight: 700, fontSize: '1rem' }}>{s.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.7 }}>{s.desc || s.description}</p>
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent)', fontSize: '0.82rem', fontWeight: 600 }}>
                  Explore <FiArrowRight size={13} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Process ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div className="section-tag" style={{ display: 'inline-flex' }}>Workflow</div>
            </div>
            <h2 className="section-title">Our Development Process</h2>
            <p className="section-subtitle">How we take your project from concept to a successful launch</p>
          </motion.div>

          <div className="process-timeline">
            {[
              { step: '01', title: 'Discovery & Strategy', desc: 'We discuss your goals, define requirement specs, estimate project budget, and create a solid project roadmap.', color: '#6366f1' },
              { step: '02', title: 'UX/UI Prototyping', desc: 'Our designers build custom wireframes and interactive mockups, giving you a detailed visual prototype of the final product.', color: '#8b5cf6' },
              { step: '03', title: 'Agile Development', desc: 'Our developers build your project using clean code and modern frameworks, ensuring full speed optimization and regular updates.', color: '#06b6d4' },
              { step: '04', title: 'Quality Assurance & Launch', desc: 'We run end-to-end testing for responsive design, security, and performance before deploying to production.', color: '#10b981' }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="process-step"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
              >
                <div className="process-icon-wrap" style={{ '--accent-color': item.color }}>
                  <span className="process-step-num">{item.step}</span>
                </div>
                <h3 className="process-step-title">{item.title}</h3>
                <p className="process-step-desc">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Projects ── */}
      {projects.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div className="section-tag" style={{ display: 'inline-flex' }}>Portfolio</div>
            </div>
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">Recent work built for our global clients</p>
            <div className="grid-3">
              {projects.map((p, i) => (
                <motion.div key={p._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProjectCard project={p} />
                </motion.div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <Link to="/projects" className="btn btn-outline">
                View All Projects <FiArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      <section className="section" style={{ background: 'var(--bg2)', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div className="section-tag" style={{ display: 'inline-flex' }}>⭐ Client Trust & Reviews</div>
            </div>
            <h2 className="section-title">What Our Global Clients Say</h2>
            <p className="section-subtitle">Real feedback from startups, businesses, and entrepreneurs we have helped scale online</p>
          </motion.div>

          {/* Social Proof Trust Bar (Only when reviews exist) */}
          {testimonials.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              margin: '0 auto 36px',
              padding: '16px 24px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              maxWidth: '850px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                  {[...Array(5)].map((_, i) => <FiStar key={i} size={15} style={{ fill: '#f59e0b', color: '#f59e0b' }} />)}
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>
                  5.0/5 Client Rating (100% Recommended)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text2)', fontWeight: 600 }}>
                <span>🌍</span> Global Delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: 'var(--text2)', fontWeight: 600 }}>
                <span style={{ color: '#10b981' }}>⚡</span> 100% On-Time Project Delivery
              </div>
            </div>
          )}

          {/* Category Filter Tabs */}
          {testimonials.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '36px'
            }}>
              {['All', 'Business Website', 'E-Commerce Store', 'Real Estate Portal', 'SaaS Landing Page', 'Gym & Booking System', 'Healthcare Website', 'Corporate Business Site']
                .filter(cat => cat === 'All' || testimonials.some(t => t.tag === cat))
                .map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTestimonialFilter(cat)}
                    className="btn"
                    style={{
                      padding: '7px 18px',
                      fontSize: '0.82rem',
                      borderRadius: '50px',
                      fontWeight: 600,
                      background: selectedTestimonialFilter === cat ? 'var(--accent)' : 'var(--card)',
                      color: selectedTestimonialFilter === cat ? '#fff' : 'var(--text2)',
                      border: `1px solid ${selectedTestimonialFilter === cat ? 'var(--accent)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedTestimonialFilter === cat ? '0 4px 14px rgba(99,102,241,0.35)' : 'none'
                    }}
                  >
                    {cat}
                  </button>
                ))}
            </div>
          )}
          
          {testimonials.length === 0 ? (
            <div className="card" style={{ 
              textAlign: 'center', 
              padding: '48px 24px', 
              maxWidth: '600px',
              margin: '0 auto 20px auto',
              border: '1px dashed var(--border)',
              borderRadius: '20px'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⭐</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>No Client Reviews Yet</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
                Have you worked with DevSphere Global? Be the first to share your experience and feedback!
              </p>
              <button 
                onClick={() => setShowTestimonialForm(true)} 
                className="btn btn-primary"
                style={{ padding: '10px 24px', fontWeight: 600 }}
              >
                ⭐ Share Your Experience
              </button>
            </div>
          ) : (() => {
            const filtered = selectedTestimonialFilter === 'All'
              ? testimonials
              : testimonials.filter(t => t.tag === selectedTestimonialFilter);

            return filtered.length > 0 ? (
              <div className="grid-3">
                {filtered.map((t, i) => (
                  <motion.div key={t._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <TestimonialCard testimonial={t} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ 
                textAlign: 'center', 
                padding: '40px 20px', 
                maxWidth: '600px',
                margin: '0 auto 40px auto',
                border: '1px dashed var(--border)'
              }}>
                <p style={{ fontStyle: 'italic', marginBottom: '8px', fontSize: '1.1rem', color: 'var(--text1)' }}>No reviews in this category yet.</p>
                <button onClick={() => setSelectedTestimonialFilter('All')} className="btn btn-outline" style={{ marginTop: '12px' }}>
                  View All Reviews
                </button>
              </div>
            );
          })()}

          {/* Testimonial Form Toggle & Section */}
          {testimonials.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <button
                onClick={() => setShowTestimonialForm(!showTestimonialForm)}
                className="btn btn-outline"
                style={{ padding: '10px 24px', fontWeight: 600, gap: '8px' }}
              >
                {showTestimonialForm ? 'Hide Review Form' : '⭐ Share Your Experience Working With Us'}
              </button>
            </div>
          )}

          <AnimatePresence>
            {showTestimonialForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                style={{ overflow: 'hidden', marginTop: '36px' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '6px' }}>Leave a Client Review</h3>
                  <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Worked with us? We'd love to hear your feedback.</p>
                </div>
                <TestimonialForm onSubmitted={() => setShowTestimonialForm(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div className="section-tag" style={{ display: 'inline-flex' }}>Why Choose Us</div>
            </div>
            <h2 className="section-title">Built for Results</h2>
            <p className="section-subtitle">What sets our work apart from the rest</p>
          </motion.div>

          <div className="grid-3">
            {[
              { icon: <FiZap />, title: 'Fast Delivery', desc: 'Projects delivered on time, every time. Basic sites in 7 days.', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', path: '/contact' },
              { icon: <FiCode />, title: 'Clean Code', desc: 'Well-structured, documented code you can maintain and scale.', color: '#6366f1', bg: 'rgba(99,102,241,0.12)', path: '/projects' },
              { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Always available for questions and quick fixes during support period.', color: '#10b981', bg: 'rgba(16,185,129,0.12)', path: '/contact' }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(item.path)}
                style={{ borderTop: `3px solid ${item.color}`, padding: '28px', cursor: 'pointer' }}
                title={`Click to learn more about ${item.title}`}
              >
                <div style={{ width: 52, height: 52, borderRadius: '14px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, fontSize: '1.4rem', marginBottom: '18px' }}>
                  {item.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Client Portal Promotion ── */}
      <section className="section" style={{ background: 'var(--bg2)' }}>
        <div className="container">
          <div className="client-portal-promo-card">
            <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
            
            <div>
              <div className="section-tag" style={{ marginBottom: '16px' }}>Interactive Portal</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: '18px', lineHeight: 1.2 }}>
                Manage Your Project Through Our <span className="gradient-text">Client Portal</span>
              </h2>
              <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '28px', fontSize: '0.95rem' }}>
                We believe in complete transparency. Our custom client dashboard lets you check project milestones, download invoices, calculate price estimates, and raise support tickets in real-time.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <Link to="/login" className="btn btn-primary">Log In to Portal</Link>
                <Link to="/cost-estimator" className="btn btn-outline">Estimate Project Cost</Link>
              </div>
              <PaymentBadges showText={true} align="left" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { title: 'Milestone Tracking', desc: 'Track your project development step-by-step from your dashboard.' },
                { title: 'Billing & Invoices', desc: 'Securely pay milestones, download invoices, and manage payment receipts.' },
                { title: 'Instant Cost Estimator', desc: 'Plan your budget instantly using our interactive calculator.' }
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>
                    {idx + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px', color: 'var(--text)' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.5 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Free Website Audit Lead Banner ── */}
      <section className="section" style={{ background: 'var(--bg)', paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(124, 58, 237, 0.12) 50%, rgba(6, 182, 212, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '24px',
              padding: 'clamp(28px, 4vw, 48px)',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '36px',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />

            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.35)', color: 'var(--accent)', padding: '5px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '16px' }}>
                <FiZap size={14} /> FREE AUDIT & CONSULTATION
              </div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: '14px', color: 'var(--text)' }}>
                Is Your Current Website <span className="gradient-text">Costing You Clients?</span>
              </h2>
              <p style={{ color: 'var(--text2)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '24px' }}>
                Let our senior developers inspect your site’s speed, mobile conversion blockers, and technical SEO bottlenecks. Get a personalized audit report delivered in 24 hours — <strong>100% Free</strong> with zero sales pressure.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={openAuditModal}
                  className="btn btn-primary"
                  style={{ padding: '12px 28px', fontSize: '0.95rem', fontWeight: 700, boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
                >
                  🎁 Claim Free Audit Report (Worth $299)
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                ⚡ What You Get Inside Your Free Audit:
              </div>
              {[
                { title: 'Speed & Core Web Vitals', desc: 'Identify heavy scripts, slow TTFB, and assets slowing down your store.' },
                { title: 'Mobile UI/UX Friction', desc: 'Find tap target errors, layout shifts, and mobile checkout drop-offs.' },
                { title: 'SEO & Google Indexing', desc: 'Check meta tags, schema markup, and competitor ranking gaps.' },
                { title: '3 Actionable Quick Fixes', desc: 'Step-by-step developer recommendations to boost conversion immediately.' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#10b981', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>✓</span>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text)', display: 'block' }}>{item.title}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.4 }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div className="section-tag" style={{ display: 'inline-flex' }}>Contact</div>
          </div>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Have a project in mind? Let's talk about it.</p>

          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '56px', alignItems: 'start' }}>
            {/* Left: Info */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '14px', fontWeight: 700 }}>Let's work together</h3>
              <p style={{ color: 'var(--text2)', lineHeight: 1.85, marginBottom: '36px', fontSize: '0.95rem' }}>
                We are available for new projects worldwide. Whether you need a simple website, an e-commerce store, or a complex web application, our agency is here to help.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
                {[
                  { icon: <FiMail />, label: 'Email', value: 'devsphereglobal@gmail.com', href: 'mailto:devsphereglobal@gmail.com', color: '#6366f1' },
                  { icon: <FaWhatsapp />, label: 'WhatsApp', value: '+91 83539 49006', href: 'https://wa.me/918353949006', color: '#25D366' },
                  { icon: <FiMapPin />, label: 'Location', value: 'India · Available Worldwide', href: 'https://maps.google.com/?q=Surat,+Gujarat,+India', color: '#06b6d4' },
                  { icon: <FiClock />, label: 'Response Time', value: 'Within 24 hours', subNote: 'Available for Zoom & Google Meet calls', href: 'mailto:devsphereglobal@gmail.com?subject=Schedule%20Discovery%20Call', color: '#f59e0b' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        title={`Open ${item.label}`}
                        style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: `${item.color}12`,
                          border: `1px solid ${item.color}25`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: item.color, flexShrink: 0, fontSize: '1rem',
                          textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.background = `${item.color}22`; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = `${item.color}12`; }}
                      >
                        {item.icon}
                      </a>
                    ) : (
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: `${item.color}12`,
                        border: `1px solid ${item.color}25`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: item.color, flexShrink: 0, fontSize: '1rem'
                      }}>
                        {item.icon}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.label}
                      </div>
                      {item.href ? (
                        <a href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.92rem', transition: 'var(--transition)' }}
                          onMouseEnter={e => e.currentTarget.style.color = item.color}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.value}</div>
                      )}
                      {item.subNote && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: '#10b981', fontWeight: 600, marginTop: '2px' }}>
                          <span>📹</span> {item.subNote}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="https://wa.me/918353949006?text=Hi%20DevSphere%20Global!%20I%20want%20to%20discuss%20a%20project."
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{ background: '#25D366', color: 'white', boxShadow: '0 4px 20px rgba(37,211,102,0.3)', fontWeight: 700 }}
              >
                <FaWhatsapp size={18} /> Chat on WhatsApp
              </a>
            </motion.div>

            {/* Right: Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <form onSubmit={handleContactSubmit} className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label htmlFor="home-contact-name" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                      Your Name *
                    </label>
                    <input id="home-contact-name" name="name" value={contactForm.name} onChange={handleContactChange} placeholder="John Smith" required />
                  </div>
                  <div>
                    <label htmlFor="home-contact-email" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                      Email Address *
                    </label>
                    <input id="home-contact-email" name="email" type="email" value={contactForm.email} onChange={handleContactChange} placeholder="john@example.com" required />
                  </div>
                </div>

                <div>
                  <label htmlFor="home-contact-subject" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                    Subject
                  </label>
                  <input id="home-contact-subject" name="subject" value={contactForm.subject} onChange={handleContactChange} placeholder="Project Inquiry" />
                </div>

                <div>
                  <label htmlFor="home-contact-message" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                    Message *
                  </label>
                  <textarea id="home-contact-message" name="message" value={contactForm.message} onChange={handleContactChange}
                    placeholder="Tell us about your project, timeline, and budget..." required rows={6}
                    style={{ resize: 'vertical', minHeight: '140px' }} />
                </div>

                <button type="submit" className="btn btn-primary" disabled={contactLoading || contactSent}
                  style={{ alignSelf: 'flex-start', minWidth: '160px', justifyContent: 'center' }}>
                  {contactSent
                    ? <><FiCheck size={15} /> Message Sent!</>
                    : contactLoading
                      ? 'Sending...'
                      : <><FiSend size={15} /> Send Message</>
                  }
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>



      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-box"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Ready to build something amazing?</h2>
            <p>Let's discuss your project and bring your vision to life.</p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
              <Link to="/contact" className="btn btn-cta-white">
                Start a Project <FiArrowRight size={15} />
              </Link>
              <Link to="/pricing" className="btn btn-cta-outline">
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
