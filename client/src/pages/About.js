import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
  FiAward,
  FiCheck,
  FiZap,
  FiExternalLink,
  FiCode,
  FiShield,
  FiServer,
  FiDatabase,
  FiLayout,
  FiCloud,
  FiActivity,
  FiTerminal,
  FiCheckCircle,
  FiGlobe
} from 'react-icons/fi';
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaWhatsapp,
  FaDocker,
  FaAws
} from 'react-icons/fa';
import {
  SiMongodb,
  SiExpress,
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiPostgresql,
  SiRedis,
  SiTailwindcss,
  SiVercel,
  SiCloudflare,
  SiGit,
  SiGraphql
} from 'react-icons/si';

const achievements = [
  { icon: '⚡', title: '100/100', desc: 'Core Web Vitals Performance' },
  { icon: '🎯', title: '100%', desc: 'On-Time Project Delivery' },
  { icon: '🌍', title: '5+ Countries', desc: 'Global Clients (USA, UK, AU, IN)' },
  { icon: '⭐', title: '5.0 / 5.0', desc: 'Client Satisfaction Rating' }
];

const techCategories = [
  {
    category: 'Frontend Architecture',
    desc: 'Ultra-fast, responsive user interfaces & web apps',
    icon: <FiLayout />,
    color: '#61dafb',
    bg: 'rgba(97, 218, 251, 0.12)',
    items: [
      { name: 'React.js', tag: 'Core SPA Library', icon: <FaReact />, color: '#61dafb', link: 'https://react.dev' },
      { name: 'Next.js 15', tag: 'SSR & Edge Runtime', icon: <SiNextdotjs />, color: '#ffffff', link: 'https://nextjs.org' },
      { name: 'TypeScript', tag: 'Type-Safe Architecture', icon: <SiTypescript />, color: '#3178c6', link: 'https://www.typescriptlang.org' },
      { name: 'Tailwind CSS', tag: 'Utility-First Styling', icon: <SiTailwindcss />, color: '#38bdf8', link: 'https://tailwindcss.com' },
      { name: 'JavaScript ES6+', tag: 'Modern Web Standards', icon: <SiJavascript />, color: '#f7df1e', link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' }
    ]
  },
  {
    category: 'Backend & APIs',
    desc: 'Scalable microservices, business logic & payments',
    icon: <FiServer />,
    color: '#68a063',
    bg: 'rgba(104, 160, 99, 0.12)',
    items: [
      { name: 'Node.js', tag: 'Event-Driven Engine', icon: <FaNodeJs />, color: '#68a063', link: 'https://nodejs.org' },
      { name: 'Express.js', tag: 'High-Throughput APIs', icon: <SiExpress />, color: '#e5e7eb', link: 'https://expressjs.com' },
      { name: 'Python', tag: 'Data & Automation', icon: <FaPython />, color: '#3776ab', link: 'https://www.python.org' },
      { name: 'REST & GraphQL', tag: 'Clean Contract APIs', icon: <SiGraphql />, color: '#e10098', link: 'https://graphql.org' },
      { name: 'OAuth & JWT', tag: 'Bank-Grade Security', icon: <FiShield />, color: '#10b981', link: 'https://jwt.io' }
    ]
  },
  {
    category: 'Database & Storage',
    desc: 'Reliable, ACID-compliant & low-latency persistence',
    icon: <FiDatabase />,
    color: '#47a248',
    bg: 'rgba(71, 162, 72, 0.12)',
    items: [
      { name: 'MongoDB', tag: 'Flexible Document Store', icon: <SiMongodb />, color: '#47a248', link: 'https://www.mongodb.com' },
      { name: 'PostgreSQL', tag: 'Relational DB & SQL', icon: <SiPostgresql />, color: '#336791', link: 'https://www.postgresql.org' },
      { name: 'Redis Cache', tag: 'In-Memory Caching <5ms', icon: <SiRedis />, color: '#dc382d', link: 'https://redis.io' },
      { name: 'Mongoose ODM', tag: 'Schema-Driven Modeling', icon: <FiDatabase />, color: '#991b1b', link: 'https://mongoosejs.com' }
    ]
  },
  {
    category: 'DevOps & Cloud',
    desc: 'Zero-downtime CI/CD, edge CDN & global deployments',
    icon: <FiCloud />,
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.12)',
    items: [
      { name: 'Docker', tag: 'Containerized Services', icon: <FaDocker />, color: '#2496ed', link: 'https://www.docker.com' },
      { name: 'Cloudflare', tag: 'Global Edge & DDoS Shield', icon: <SiCloudflare />, color: '#f38020', link: 'https://www.cloudflare.com' },
      { name: 'AWS Cloud', tag: 'Scalable Infrastructure', icon: <FaAws />, color: '#ff9900', link: 'https://aws.amazon.com' },
      { name: 'Vercel / Render', tag: 'Continuous Git Deployment', icon: <SiVercel />, color: '#ffffff', link: 'https://vercel.com' },
      { name: 'Git & GitHub CI', tag: 'Automated Build Pipelines', icon: <SiGit />, color: '#f05032', link: 'https://git-scm.com' }
    ]
  }
];

const milestones = [
  {
    year: '2025 – Present',
    title: 'Global Enterprise & Multi-Market Expansion',
    tag: 'Global Operations',
    organization: 'DevSphere Global International',
    desc: 'Expanded technical client operations across USA, UK, Canada, Australia, and India. Engineered high-converting platforms, enterprise SaaS portals, and global checkout integrations with automated multi-currency settlement (Stripe, Razorpay, PayPal).',
    bullets: [
      '300+ Edge POPs delivery network for international clients',
      'Cross-border payment infrastructure (USD, GBP, EUR, INR)',
      '24-hour guaranteed SLA turnaround on priority client support'
    ]
  },
  {
    year: '2024 – 2025',
    title: '100/100 Core Web Vitals Standard & Scalable Architectures',
    tag: 'Performance Engineering',
    organization: 'High-Performance Web Systems',
    desc: 'Formalized the agency-wide 100/100 Core Web Vitals engineering benchmark. Re-architected client codebases with Next.js 15, dynamic server-side caching, and distributed CDN edge nodes achieving sub-second LCP and zero cumulative layout shift.',
    bullets: [
      'Sub-second Largest Contentful Paint (<1.0s) standard',
      'Zero layout shift guarantee (CLS 0.00)',
      'Built-in Technical SEO & Schema Structured Data'
    ]
  },
  {
    year: '2023 – 2024',
    title: 'Bespoke SaaS, Automated Portals & Client Dashboards',
    tag: 'Full-Stack Delivery',
    organization: 'Custom Systems Engineering',
    desc: 'Delivered end-to-end bespoke solutions including live project tracking dashboards, automated invoicing engines, client portals, and secure role-based access control (RBAC) systems for commercial business clients.',
    bullets: [
      'Real-time project milestone tracking dashboard for clients',
      'Automated PDF invoice generation & instant receipt delivery',
      'Unified multi-gateway checkout processing'
    ]
  },
  {
    year: '2022 – 2023',
    title: 'Foundational Systems Engineering & Cloud Architecture',
    tag: 'Engineering Foundations',
    organization: 'Core Architecture Genesis',
    desc: 'Established the agency software engineering foundation: strict code audit standards, microservices design patterns, relational and document database indexing, and continuous zero-downtime deployment pipelines.',
    bullets: [
      'Containerized Docker development & staging workflows',
      'Automated code quality, type-checking & security audits',
      'High-availability MongoDB & PostgreSQL schema design'
    ]
  }
];

export default function About() {
  const [activeHeroTab, setActiveHeroTab] = useState('telemetry');

  return (
    <div className="page-wrapper">
      <div className="container section">

        {/* ── Agency Hero ── */}
        <div className="about-hero-grid">
          {/* Left: Text & Intro */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="badge" style={{ marginBottom: '16px', display: 'inline-block' }}>About DevSphere Global</span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '20px', lineHeight: 1.2 }}>
              We are <span className="gradient-text">DevSphere Global</span>,<br />a Web Development Agency
            </h1>
            <div className="about-meta">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text2)', fontSize: '0.9rem', fontWeight: 600 }}>
                <FiMapPin style={{ color: 'var(--accent)' }} /> Worldwide (Remote Agency)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text2)', fontSize: '0.9rem', fontWeight: 600 }}>
                <FiBriefcase style={{ color: 'var(--accent)' }} /> 3+ Years Global Experience
              </span>
            </div>
            <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '16px', fontSize: '1.05rem' }}>
              We are a specialized digital agency engineering high-performance, scalable web applications and conversion-optimized websites for startups, businesses, and enterprises worldwide.
            </p>
            <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '32px' }}>
              With deep expertise in <strong style={{ color: 'var(--text)' }}>Next.js, React, Node.js, MongoDB, and multi-currency payment gateways</strong>, we transform ideas into revenue-generating digital products. Every project is engineered with 100/100 Core Web Vitals standards and scalable architectures.
            </p>
            <div className="about-actions">
              <Link to="/contact" className="btn btn-primary">
                Start a Project <FiArrowRight />
              </Link>
              <Link to="/services" className="btn btn-outline">
                Our Services
              </Link>
            </div>
          </motion.div>

          {/* Right: Interactive Agency Architecture & Code Telemetry Visual */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="agency-telemetry-wrapper">
              <div className="agency-telemetry-card">
                {/* Terminal Topbar */}
                <div className="terminal-topbar">
                  <div className="terminal-dots">
                    <span className="terminal-dot dot-red" />
                    <span className="terminal-dot dot-yellow" />
                    <span className="terminal-dot dot-green" />
                  </div>

                  <div className="terminal-tabs">
                    <button
                      className={`terminal-tab-btn ${activeHeroTab === 'telemetry' ? 'active' : ''}`}
                      onClick={() => setActiveHeroTab('telemetry')}
                      type="button"
                    >
                      <FiActivity size={12} /> Telemetry
                    </button>
                    <button
                      className={`terminal-tab-btn ${activeHeroTab === 'code' ? 'active' : ''}`}
                      onClick={() => setActiveHeroTab('code')}
                      type="button"
                    >
                      <FiTerminal size={12} /> agencyEngine.ts
                    </button>
                  </div>
                </div>

                {/* Tab 1: Telemetry View */}
                {activeHeroTab === 'telemetry' && (
                  <div className="telemetry-body">
                    <div className="telemetry-header-badge">
                      <div className="status-pill">
                        <span className="pulse-dot" /> LIVE PRODUCTION ENGINE
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text3)', fontWeight: 600 }}>
                        Edge PoPs: 300+ Active
                      </span>
                    </div>

                    <div className="telemetry-grid">
                      <div className="telemetry-metric-box">
                        <div className="telemetry-metric-val">100/100</div>
                        <div className="telemetry-metric-label">Core Web Vitals</div>
                        <div className="telemetry-metric-sub">LCP 0.8s · CLS 0.00 · FID &lt;10ms</div>
                      </div>

                      <div className="telemetry-metric-box">
                        <div className="telemetry-metric-val">&lt; 45ms</div>
                        <div className="telemetry-metric-label">Global CDN Latency</div>
                        <div className="telemetry-metric-sub">US, EU, APAC Edge Anycast</div>
                      </div>

                      <div className="telemetry-metric-box">
                        <div className="telemetry-metric-val">99.99%</div>
                        <div className="telemetry-metric-label">Production SLA Uptime</div>
                        <div className="telemetry-metric-sub">Zero-Downtime Deployments</div>
                      </div>

                      <div className="telemetry-metric-box">
                        <div className="telemetry-metric-val">Multi-Pay</div>
                        <div className="telemetry-metric-label">Global Checkout</div>
                        <div className="telemetry-metric-sub">Stripe · PayPal · Razorpay</div>
                      </div>
                    </div>

                    <div className="telemetry-footer-banner">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiShield style={{ color: '#10b981' }} />
                        <span><strong>Security:</strong> Bank-Grade TLS 1.3 & OWASP Top 10 Compliant</span>
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700 }}>VERIFIED</span>
                    </div>
                  </div>
                )}

                {/* Tab 2: Code Preview View */}
                {activeHeroTab === 'code' && (
                  <div className="code-preview-body">
                    <pre style={{ margin: 0, background: 'none', padding: 0 }}>
                      <code>
                        <span className="code-comment">// DevSphere Global Enterprise Engine</span>{'\n'}
                        <span className="code-keyword">import</span> {'{'} CloudEdge, SecurityEngine, PaymentGateway {'}'} <span className="code-keyword">from</span> <span className="code-string">'@devsphere/core'</span>;{'\n\n'}
                        <span className="code-keyword">export const</span> <span className="code-entity">agencyArchitecture</span> = <span className="code-keyword">new</span> <span className="code-entity">EnterpriseAgency</span>({'{'}{'\n'}
                        {'  '}name: <span className="code-string">"DevSphere Global"</span>,{'\n'}
                        {'  '}stack: [<span className="code-string">"Next.js 15"</span>, <span className="code-string">"Node.js"</span>, <span className="code-string">"MongoDB"</span>, <span className="code-string">"Redis"</span>],{'\n'}
                        {'  '}benchmarks: {'{'}{'\n'}
                        {'    '}coreWebVitals: <span className="code-bool">100</span>, <span className="code-comment">// Verified Perfect Score</span>{'\n'}
                        {'    '}onTimeDelivery: <span className="code-string">"100%"</span>, <span className="code-comment">// Guaranteed SLA</span>{'\n'}
                        {'    '}globalLatency: <span className="code-string">"&lt; 45ms"</span>,{'\n'}
                        {'    '}securityGrade: <span className="code-string">"OWASP-A+"</span>{'\n'}
                        {'  '}{'}'},{'\n'}
                        {'  '}payments: [PaymentGateway.STRIPE, PaymentGateway.PAYPAL, PaymentGateway.RAZORPAY],{'\n'}
                        {'  '}status: <span className="code-string">"ACCEPTING_GLOBAL_PROJECTS"</span>{'\n'}
                        {'}'});{'\n\n'}
                        <span className="code-keyword">await</span> agencyArchitecture.<span className="code-entity">deployClientSuccess</span>();
                      </code>
                    </pre>
                  </div>
                )}

                {/* Status Bar */}
                <div className="terminal-statusbar">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FiTerminal size={11} /> branch: main (verified)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    global edge anycast active
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Value-Driven Metrics Grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '90px' }}
        >
          <div className="grid-4">
            {achievements.map((a, i) => (
              <motion.div
                key={i}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ textAlign: 'center', padding: '32px 20px' }}
              >
                <div style={{ fontSize: '2.4rem', marginBottom: '12px' }}>{a.icon}</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {a.title}
                </div>
                <div style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '6px', fontWeight: 500 }}>
                  {a.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Technical Leadership & Governance ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '100px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div className="section-tag" style={{ display: 'inline-flex' }}>LEADERSHIP</div>
          </div>
          <h2 className="section-title">Technical Leadership & Architecture</h2>
          <p className="section-subtitle">
            Direct access to senior engineering leadership on every client project — no middle managers or outsourced code.
          </p>

          <div
            className="card about-founder-card"
            style={{
              background: 'linear-gradient(135deg, rgba(22, 22, 48, 0.95) 0%, rgba(28, 28, 58, 0.95) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              borderRadius: '24px',
              padding: 'clamp(24px, 4vw, 44px)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45), 0 0 30px rgba(99, 102, 241, 0.1)'
            }}
          >
            {/* Left: Founder Avatar & Socials */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div
                style={{
                  width: '180px',
                  height: '180px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '3px solid var(--accent)',
                  boxShadow: '0 12px 36px rgba(99, 102, 241, 0.35)',
                  marginBottom: '16px',
                  position: 'relative'
                }}
              >
                <img
                  src="/shivam555.jpg"
                  alt="Shivam Maurya"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>

              {/* Verified Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: '50px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  marginBottom: '16px'
                }}
              >
                <FiCheck size={13} /> Verified Technical Director
              </div>

              {/* Social Channels */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { icon: <FaLinkedin size={16} />, href: 'https://www.linkedin.com/in/shivam-maurya-023788305', label: 'LinkedIn', color: '#0077b5' },
                  { icon: <FaGithub size={16} />, href: 'https://github.com/Shivam9956', label: 'GitHub', color: '#ffffff' },
                  { icon: <FaTwitter size={16} />, href: 'https://x.com/DevSphereGloble', label: 'Twitter / X', color: '#1da1f2' },
                  { icon: <FaWhatsapp size={16} />, href: 'https://wa.me/918353949006', label: 'WhatsApp', color: '#25D366' }
                ].map((s, idx) => (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    title={s.label}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text2)',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = s.color;
                      e.currentTarget.style.borderColor = s.color;
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = 'var(--text2)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Bio & Key Specializations */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                  Shivam Maurya
                </h3>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(99, 102, 241, 0.3)'
                  }}
                >
                  Founder & Technical Director
                </span>
              </div>

              {/* Tagline */}
              <p
                style={{
                  fontSize: '1.02rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                  fontStyle: 'italic'
                }}
              >
                "Directing full-lifecycle technical architecture, high-performance web engineering, and enterprise client satisfaction."
              </p>

              {/* Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                  <FiZap style={{ color: '#f59e0b', flexShrink: 0, marginTop: '4px' }} />
                  <span><strong>Direct Technical Oversight:</strong> Shivam personally architects and audits every web project, guaranteeing adherence to modern clean-code and 100/100 Core Web Vitals standards.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                  <FiCode style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '4px' }} />
                  <span><strong>Full Stack Expertise:</strong> Specializes in Next.js 15, React, Node.js, Express, MongoDB, and secure global checkout integrations (Stripe, Razorpay, PayPal).</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                  <FiShield style={{ color: '#10b981', flexShrink: 0, marginTop: '4px' }} />
                  <span><strong>Advanced Systems Background:</strong> Master of Computer Applications (MCA) postgraduate candidate with rigorous focus on cloud computing and distributed algorithms.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="about-founder-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.88rem' }}>
                  Schedule Technical Discovery <FiArrowRight />
                </Link>
                <a
                  href="https://github.com/Shivam9956"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                  style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                >
                  <FaGithub size={15} /> Explore GitHub Repos
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Categorized Tech Stack Overhaul ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '100px' }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div className="section-tag" style={{ display: 'inline-flex' }}>INFRASTRUCTURE</div>
          </div>
          <h2 className="section-title">Our Tech Stack</h2>
          <p className="section-subtitle">
            Enterprise-grade frameworks, databases, and cloud infrastructure engineered for resilience, sub-second latency, and scale.
          </p>

          <div className="tech-stack-category-grid">
            {techCategories.map((cat, idx) => (
              <motion.div
                key={idx}
                className="tech-category-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="tech-category-header">
                  <div className="tech-category-icon-box" style={{ background: cat.bg, color: cat.color }}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="tech-category-title">{cat.category}</h3>
                    <div className="tech-category-sub">{cat.desc}</div>
                  </div>
                </div>

                <div className="tech-items-list">
                  {cat.items.map((item, itemIdx) => (
                    <a
                      key={itemIdx}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tech-item-row"
                      title={`Learn more about ${item.name}`}
                    >
                      <span className="tech-item-icon" style={{ color: item.color }}>
                        {item.icon}
                      </span>
                      <div className="tech-item-info">
                        <span className="tech-item-name">{item.name}</span>
                        <span className="tech-item-tag">{item.tag}</span>
                      </div>
                      <FiExternalLink className="tech-item-arrow" />
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Agency Milestones & Track Record Timeline ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div className="section-tag" style={{ display: 'inline-flex' }}>MILESTONES</div>
          </div>
          <h2 className="section-title">Agency Milestones & Engineering Track Record</h2>
          <p className="section-subtitle">
            Our strategic journey from core software engineering to high-performance global web deployments
          </p>

          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            <div className="timeline-line" style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '2px', background: 'var(--border)' }} />
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                className="milestone-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', gap: '24px', marginBottom: '36px', paddingLeft: '8px' }}
              >
                <div className="milestone-dot" style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: '4px',
                  background: 'var(--accent)',
                  boxShadow: '0 0 12px rgba(99, 102, 241, 0.6)',
                  border: '4px solid var(--bg)', zIndex: 1
                }} />
                <div className="card milestone-card" style={{ flex: 1, padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <h3 style={{ fontWeight: 800, fontSize: '1.12rem', color: 'var(--text)', margin: 0 }}>
                          {m.title}
                        </h3>
                        <span className="milestone-badge">
                          <FiGlobe size={11} /> {m.tag}
                        </span>
                      </div>
                      <div style={{ color: 'var(--accent)', fontSize: '0.88rem', fontWeight: 600 }}>
                        {m.organization}
                      </div>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text2)', fontSize: '0.82rem', fontWeight: 600, background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>
                      <FiCalendar size={12} /> {m.year}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text2)', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '16px' }}>
                    {m.desc}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {m.bullets.map((b, bIdx) => (
                      <div key={bIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'var(--text3)' }}>
                        <FiCheckCircle style={{ color: '#10b981', flexShrink: 0 }} size={13} />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Let's build something extraordinary together</h2>
          <p style={{ color: 'var(--text2)', marginBottom: '32px', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto 32px' }}>
            We are currently partnering with forward-thinking businesses and startups worldwide. Let's discuss your project architecture.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">Start a Project <FiArrowRight /></Link>
            <Link to="/projects" className="btn btn-outline">Explore Case Studies</Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
