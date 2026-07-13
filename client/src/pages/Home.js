import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { FiArrowRight, FiDownload, FiCode, FiLayout, FiDatabase, FiSmartphone, FiZap, FiHeadphones, FiMail, FiMapPin, FiSend, FiClock, FiCheck, FiStar, FiShoppingCart, FiTarget, FiRefreshCw } from 'react-icons/fi';
import { getIcon } from '../utils/iconMap';
import { FaReact, FaNodeJs, FaWhatsapp } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiJavascript, SiTypescript, SiPython } from 'react-icons/si';
import api from '../api/axios';
import toast from 'react-hot-toast';
import ProjectCard from '../components/ProjectCard';
import TestimonialCard from '../components/TestimonialCard';
import TestimonialForm from '../components/TestimonialForm';
import Typewriter from '../components/Typewriter';
import './Home.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } }
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const skills = [
  { name: 'React.js', icon: <FaReact />, color: '#61dafb', level: 95 },
  { name: 'Node.js', icon: <FaNodeJs />, color: '#68a063', level: 90 },
  { name: 'MongoDB', icon: <SiMongodb />, color: '#47a248', level: 85 },
  { name: 'Express.js', icon: <SiExpress />, color: 'var(--text)', level: 90 },
  { name: 'JavaScript', icon: <SiJavascript />, color: '#f7df1e', level: 95 },
  { name: 'TypeScript', icon: <SiTypescript />, color: '#3178c6', level: 80 },
  { name: 'Python', icon: <SiPython />, color: '#3776ab', level: 75 }
];

const defaultServices = [
  { icon: <FiStar />, title: 'Business Website ⭐', desc: 'Establish a powerful presence with custom websites for Gyms, Restaurants, Schools, Hospitals, Real Estate, Manufacturing, and Travel agencies.' },
  { icon: <FiShoppingCart />, title: 'E-commerce Website', desc: 'Fully secure, premium online stores built to grow sales for Clothing, Electronics, Grocery, Cosmetics, and Furniture.' },
  { icon: <FiTarget />, title: 'Landing Page', desc: 'High-converting single pages optimized to drive leads and maximize ROI for Coaching, SaaS, Real Estate, and ads.' },
  { icon: <FiRefreshCw />, title: 'Website Maintenance & SEO', desc: 'Ensure your website stays fast, secure, and ranks high with regular updates, speed tuning, backups, and SEO.' }
];

const techIcons = [
  { icon: <FaReact />, color: '#61dafb', label: 'React' },
  { icon: <FaNodeJs />, color: '#68a063', label: 'Node.js' },
  { icon: <SiMongodb />, color: '#47a248', label: 'MongoDB' },
  { icon: <SiExpress />, color: 'var(--text)', label: 'Express' },
  { icon: <SiJavascript />, color: '#f7df1e', label: 'JavaScript' },
  { icon: <SiPython />, color: '#3776ab', label: 'Python' }
];

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
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
    api.get('/testimonials').then(r => setTestimonials(r.data.slice(0, 3))).catch(() => {});
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
                Available for Hire
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="hero-title">
              Hi, I'm{' '}
              <span className="gradient-text">Shivam Maurya</span>
              <br />
              <Typewriter 
                words={[
                  'Full Stack Developer',
                  'Freelance Developer'
                ]} 
                typingSpeed={80} 
                deletingSpeed={40} 
                delayBetween={2500} 
              />
              <br />
              <span style={{ fontSize: '0.55em', color: 'var(--text2)', fontWeight: 500, letterSpacing: '-0.01em' }}>
                @ DevSphere Global
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="hero-subtitle">
              Building high-performance websites and web applications for global clients.
              From USA to UK, Canada to Australia — delivering world-class digital solutions.
            </motion.p>

            <motion.div variants={fadeUp} className="hero-cta">
              <Link to="/contact" className="btn btn-primary">
                Hire Me <FiArrowRight size={16} />
              </Link>
              <Link to="/projects" className="btn btn-outline">
                View Projects
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="hero-tech">
              {techIcons.map((t, i) => (
                <div key={i} className="tech-icon" title={t.label} style={{ color: t.color }}>
                  {t.icon}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Code Window */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="hero-card-main">
              <div className="code-window">
                <div className="code-dots">
                  <span /><span /><span />
                  <span style={{ marginLeft: 'auto', color: 'var(--text3)', fontSize: '0.75rem' }}>developer.js</span>
                </div>
                <pre className="code-content">
                  <span className="code-comment">{'// DevSphere Global'}</span>{'\n'}
                  <span className="code-key">const</span>{' developer = {\n'}
                  {'  '}<span className="code-key">name</span>{': '}<span className="code-str">"Shivam Maurya"</span>{',\n'}
                  {'  '}<span className="code-key">role</span>{': '}<span className="code-str">"Full Stack Dev"</span>{',\n'}
                  {'  '}<span className="code-key">agency</span>{': '}<span className="code-str">"DevSphere Global"</span>{',\n'}
                  {'  '}<span className="code-key">skills</span>{': ['}<span className="code-str">"React"</span>{', '}<span className="code-str">"Node"</span>{',\n'}
                  {'           '}<span className="code-str">"MongoDB"</span>{'],\n'}
                  {'  '}<span className="code-key">available</span>{': '}<span className="code-bool">true</span>{',\n'}
                  {'  '}<span className="code-key">experience</span>{': '}<span className="code-num">3</span>{' + '}<span className="code-str">" years"</span>{',\n'}
                  {'  '}<span className="code-key">clients</span>{': '}<span className="code-str">"Worldwide 🌍"</span>{'\n'}
                  {'};'}
                </pre>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '12px' }}>
                <motion.div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '50px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, color: '#10b981' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                  <FiZap size={12} /> Available Now
                </motion.div>
                <motion.div style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '50px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
                  🌍 Worldwide Clients
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
            >              <div className="section-tag">About Me</div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '20px' }}>
                Passionate developer with a{' '}
                <span className="gradient-text">global mindset</span>
              </h2>
              <p style={{ color: 'var(--text2)', lineHeight: 1.85, marginBottom: '16px', fontSize: '0.97rem' }}>
                I'm Shivam Maurya, a Full Stack Web Developer from India with 3+ years of experience building
                scalable web applications for clients across USA, UK, Canada, and Australia.
              </p>
              <p style={{ color: 'var(--text2)', lineHeight: 1.85, marginBottom: '36px', fontSize: '0.97rem' }}>
                I specialize in React.js, Node.js, and MongoDB — delivering clean code, modern UI/UX,
                and high-performance solutions that help businesses grow online.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary">Let's Work Together</Link>
                <a href="/Shivam%20maurya.pdf" className="btn btn-outline" download>
                  <FiDownload size={15} /> Download CV
                </a>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
                        <span style={{ color: skill.color, fontSize: '1.1rem' }}>{skill.icon}</span>
                        {skill.name}
                      </div>
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
              <div className="section-tag" style={{ display: 'inline-flex' }}>What I Do</div>
            </div>
            <h2 className="section-title">Services I Offer</h2>
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
              >
                <div className="service-icon">{s.icon && typeof s.icon === 'string' ? getIcon(s.icon) : (s.icon || getIcon('FiCode'))}</div>
                <h3 style={{ marginBottom: '10px', fontWeight: 700, fontSize: '1rem' }}>{s.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.7 }}>{s.desc || s.description}</p>
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
            <p className="section-subtitle">Some of my recent work for global clients</p>
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
      {testimonials.length > 0 && (
        <section className="section" style={{ background: 'var(--bg2)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div className="section-tag" style={{ display: 'inline-flex' }}>Reviews</div>
            </div>
            <h2 className="section-title">Client Testimonials</h2>
            <p className="section-subtitle">What my clients say about working with me</p>
            <div className="grid-3">
              {testimonials.map((t, i) => (
                <motion.div key={t._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <TestimonialCard testimonial={t} />
                </motion.div>
              ))}
            </div>

            {/* Testimonial Form */}
            <div style={{ marginTop: '64px' }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Share Your Experience</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.95rem' }}>Worked with me? I'd love to hear your feedback.</p>
              </div>
              <TestimonialForm />
            </div>
          </div>
        </section>
      )}

      {/* ── Why Choose Me ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div className="section-tag" style={{ display: 'inline-flex' }}>Why Choose Me</div>
            </div>
            <h2 className="section-title">Built for Results</h2>
            <p className="section-subtitle">What sets my work apart from the rest</p>
          </motion.div>

          <div className="grid-3">
            {[
              { icon: <FiZap />, title: 'Fast Delivery', desc: 'Projects delivered on time, every time. Basic sites in 7 days.', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
              { icon: <FiCode />, title: 'Clean Code', desc: 'Well-structured, documented code you can maintain and scale.', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
              { icon: <FiHeadphones />, title: '24/7 Support', desc: 'Always available for questions and quick fixes during support period.', color: '#10b981', bg: 'rgba(16,185,129,0.12)' }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ borderTop: `3px solid ${item.color}`, padding: '28px' }}
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
                I'm available for freelance projects worldwide. Whether you need a simple website or a complex web application, I'm here to help.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
                {[
                  { icon: <FiMail />, label: 'Email', value: 'devsphereglobal@gmail.com', href: 'mailto:devsphereglobal@gmail.com', color: '#6366f1' },
                  { icon: <FaWhatsapp />, label: 'WhatsApp', value: '+91 83539 49006', href: 'https://wa.me/918353949006', color: '#25D366' },
                  { icon: <FiMapPin />, label: 'Location', value: 'India · Available Worldwide', href: null, color: '#06b6d4' },
                  { icon: <FiClock />, label: 'Response Time', value: 'Within 24 hours', href: null, color: '#f59e0b' }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${item.color}12`,
                      border: `1px solid ${item.color}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: item.color, flexShrink: 0, fontSize: '1rem'
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: '2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {item.label}
                      </div>
                      {item.href ? (
                        <a href={item.href} style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.92rem', transition: 'var(--transition)' }}
                          onMouseEnter={e => e.currentTarget.style.color = item.color}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{item.value}</div>
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
                    placeholder="Tell me about your project, timeline, and budget..." required rows={6}
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
