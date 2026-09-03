import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiDownload,
  FiArrowRight,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
  FiAward,
  FiCheck,
  FiZap,
  FiExternalLink,
  FiCode,
  FiShield
} from 'react-icons/fi';
import { FaReact, FaNodeJs, FaPython, FaLinkedin, FaGithub, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiJavascript, SiTypescript, SiDocker, SiGit } from 'react-icons/si';

const skills = [
  { name: 'React.js', icon: <FaReact />, color: '#61dafb', level: 95, link: 'https://react.dev' },
  { name: 'Node.js', icon: <FaNodeJs />, color: '#68a063', level: 90, link: 'https://nodejs.org' },
  { name: 'Python', icon: <FaPython />, color: '#3776ab', level: 82, link: 'https://www.python.org' },
  { name: 'MongoDB', icon: <SiMongodb />, color: '#47a248', level: 85, link: 'https://www.mongodb.com' },
  { name: 'Express.js', icon: <SiExpress />, color: '#aaaaaa', level: 90, link: 'https://expressjs.com' },
  { name: 'JavaScript', icon: <SiJavascript />, color: '#f7df1e', level: 95, link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
  { name: 'TypeScript', icon: <SiTypescript />, color: '#3178c6', level: 75, link: 'https://www.typescriptlang.org' },
  { name: 'Git', icon: <SiGit />, color: '#f05032', level: 88, link: 'https://git-scm.com' }
];

const experience = [
  {
    year: '2024 – Present',
    role: 'Founder & Lead Full Stack Architect',
    company: 'DevSphere Global',
    desc: 'Directing technical strategy and building scalable web applications for international clients across USA, UK, Canada, Australia, and India.',
    type: 'work'
  },
  {
    year: '2022 – 2024',
    role: 'Full Stack Developer',
    company: 'Freelance & Contract',
    desc: 'Delivered 5+ end-to-end client systems including e-commerce platforms, SaaS dashboards, and automated booking systems.',
    type: 'work'
  },
  {
    year: '2021 – 2022',
    role: 'Frontend Developer',
    company: 'Startup (Remote)',
    desc: 'Engineered responsive React applications with performance optimizations, Core Web Vitals compliance, and RESTful API integrations.',
    type: 'work'
  },
  {
    year: '2025 – Present',
    role: 'MCA (Master of Computer Applications)',
    company: 'Bhagwan Mahavir University (BMU), Surat',
    desc: 'Postgraduate specialization in cloud computing, distributed systems, web architectures, and advanced algorithms.',
    type: 'education'
  },
  {
    year: '2022 – 2025',
    role: 'BCA (Bachelor of Computer Applications)',
    company: 'Bhagwan Mahavir University (BMU), Surat',
    desc: 'Graduated with high honors focusing on software engineering, database management, and web technologies.',
    type: 'education'
  }
];

const achievements = [
  { icon: '🏆', title: '5+ Projects', desc: 'Delivered on-time globally' },
  { icon: '🌍', title: '5+ Countries', desc: 'Clients in USA, UK, AU, IN' },
  { icon: '⭐', title: '5.0 / 5 Rating', desc: 'Client satisfaction score' },
  { icon: '⚡', title: '3+ Years', desc: 'Professional development' }
];

export default function About() {
  return (
    <div className="page-wrapper">
      <div className="container section">

        {/* ── Agency Hero ── */}
        <div className="about-hero-grid">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="about-image-container">
              <img
                src="/shivam555.jpg"
                alt="Shivam Maurya - DevSphere Global Founder"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              />
              {/* Availability badge */}
              <div style={{
                position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(16,185,129,0.92)', backdropFilter: 'blur(10px)',
                color: 'white', padding: '8px 20px', borderRadius: '50px',
                fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 20px rgba(16,185,129,0.4)'
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                Accepting New Projects (Q3 2026)
              </div>
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
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
        </div>

        {/* ── Achievements Grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '90px' }}
        >
          <div className="grid-4">
            {achievements.map((a, i) => (
              <motion.div key={i} className="card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{a.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{a.title}</div>
                <div style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '4px', fontWeight: 500 }}>{a.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Founder & Leadership Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '100px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <div className="section-tag" style={{ display: 'inline-flex' }}>LEADERSHIP</div>
          </div>
          <h2 className="section-title">Meet Our Founder & Lead Developer</h2>
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
                <FiCheck size={13} /> Verified Lead Developer
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
                  Founder & Lead Developer
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
                "Full Stack Engineer specializing in scalable web apps and high-converting agency architectures."
              </p>

              {/* Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                  <FiZap style={{ color: '#f59e0b', flexShrink: 0, marginTop: '4px' }} />
                  <span><strong>Direct Technical Partnership:</strong> Shivam directly architects, codes, and oversees every web project from initial wireframe to live production deployment.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                  <FiCode style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '4px' }} />
                  <span><strong>Full Stack Expertise:</strong> Specializes in Next.js 15, React, Node.js, Express, MongoDB, and secure global checkout integrations (Stripe, Razorpay, PayPal).</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                  <FiShield style={{ color: '#10b981', flexShrink: 0, marginTop: '4px' }} />
                  <span><strong>Academic & Engineering Background:</strong> MCA (Master of Computer Applications) postgraduate candidate with rigorous focus on cloud computing and distributed algorithms.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.88rem' }}>
                  Schedule Discovery Call <FiArrowRight />
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

          <style>{`
            @media (max-width: 840px) {
              .card[style*="grid-template-columns"] {
                grid-template-columns: 1fr !important;
                text-align: center;
              }
            }
          `}</style>
        </motion.div>

        {/* ── Technical Skills ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '100px' }}>
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-subtitle">Technologies our engineering team works with daily</p>
          <div className="about-skills-grid">
            {skills.map((skill, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                  <a
                    href={skill.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', color: skill.color, fontWeight: 600, textDecoration: 'none', cursor: 'pointer' }}
                    title={`Open ${skill.name} documentation`}
                  >
                    {skill.icon} {skill.name}
                  </a>
                  <span style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{skill.level}%</span>
                </div>
                <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <motion.div
                    style={{ height: '100%', background: 'var(--gradient)', borderRadius: '4px' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.08 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Experience Timeline ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '80px' }}>
          <h2 className="section-title">Experience & Background</h2>
          <p className="section-subtitle">Our track record & technical milestones</p>
          <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '20px', top: 0, bottom: 0, width: '2px', background: 'var(--border)' }} />
            {experience.map((exp, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', gap: '24px', marginBottom: '32px', paddingLeft: '8px' }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: '4px',
                  background: exp.type === 'work' ? 'var(--accent)' : 'var(--accent3)',
                  border: '3px solid var(--bg)', zIndex: 1
                }} />
                <div className="card" style={{ flex: 1, padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{exp.role}</div>
                      <div style={{ color: 'var(--accent)', fontSize: '0.88rem', fontWeight: 600 }}>{exp.company}</div>
                    </div>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text2)', fontSize: '0.82rem' }}>
                      <FiCalendar size={12} /> {exp.year}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.6 }}>{exp.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Bottom CTA ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Let's build something great together</h2>
          <p style={{ color: 'var(--text2)', marginBottom: '32px', fontSize: '1.05rem' }}>
            We are currently accepting new projects worldwide. Let's discuss your vision.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">Get In Touch <FiArrowRight /></Link>
            <Link to="/projects" className="btn btn-outline">View Our Projects</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
