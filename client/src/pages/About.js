import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDownload, FiArrowRight, FiMapPin, FiCalendar, FiBriefcase, FiAward } from 'react-icons/fi';
import { FaReact, FaNodeJs, FaPython } from 'react-icons/fa';
import { SiMongodb, SiExpress, SiJavascript, SiTypescript, SiDocker, SiGit } from 'react-icons/si';

const skills = [
  { name: 'React.js', icon: <FaReact />, color: '#61dafb', level: 95 },
  { name: 'Node.js', icon: <FaNodeJs />, color: '#68a063', level: 90 },
  { name: 'Python', icon: <FaPython />, color: '#3776ab', level: 82 },
  { name: 'MongoDB', icon: <SiMongodb />, color: '#47a248', level: 85 },
  { name: 'Express.js', icon: <SiExpress />, color: '#aaaaaa', level: 90 },
  { name: 'JavaScript', icon: <SiJavascript />, color: '#f7df1e', level: 95 },
  { name: 'TypeScript', icon: <SiTypescript />, color: '#3178c6', level: 75 },
  { name: 'Git', icon: <SiGit />, color: '#f05032', level: 88 },
];

const experience = [
  {
    year: '2024 – Present',
    role: 'Founder & Full Stack Developer',
    company: 'DevSphere Global',
    desc: 'Building high-performance web applications for global clients across USA, UK, Canada, and Australia.',
    type: 'work'
  },
  {
    year: '2022 – 2024',
    role: 'Full Stack Developer',
    company: 'Freelance',
    desc: 'Delivered 5+ projects including e-commerce platforms, SaaS applications, and custom web apps.',
    type: 'work'
  },
  {
    year: '2021 – 2022',
    role: 'Frontend Developer',
    company: 'Startup (Remote)',
    desc: 'Built responsive React.js applications with modern UI/UX and REST API integrations.',
    type: 'work'
  },
  {
    year: '2025 – Present',
    role: 'MCA (Master of Computer Applications)',
    company: 'Bhagwan Mahavir University (BMU), Surat',
    desc: 'Specializing in advanced software development, cloud computing, and full-stack web technologies.',
    type: 'education'
  },
  {
    year: '2022 – 2025',
    role: 'BCA (Bachelor of Computer Applications)',
    company: 'Bhagwan Mahavir University (BMU), Surat',
    desc: 'Graduated with focus on software engineering, data structures, web technologies, and programming fundamentals.',
    type: 'education'
  }
];

const achievements = [
  { icon: '🏆', title: '5+ Projects', desc: 'Delivered successfully' },
  { icon: '🌍', title: '5+ Countries', desc: 'Clients served globally' },
  { icon: '⭐', title: '5-Star Rating', desc: 'Average client rating' },
  { icon: '⚡', title: '3+ Years', desc: 'Professional experience' },
];

export default function About() {
  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container section">

        {/* Hero */}
        <div className="about-hero-grid">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="about-image-container">
              <img
                src="/shivam555.jpg"
                alt="Shivam Maurya"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              />
              {/* Availability badge */}
              <div style={{
                position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(16,185,129,0.9)', backdropFilter: 'blur(10px)',
                color: 'white', padding: '8px 20px', borderRadius: '50px',
                fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                Available for Projects
              </div>
            </div>
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="badge" style={{ marginBottom: '16px', display: 'inline-block' }}>About Me</span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '20px', lineHeight: 1.2 }}>
              I'm <span className="gradient-text">Shivam Maurya</span>,<br />Full Stack Developer
            </h1>
            <div className="about-meta">
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text2)', fontSize: '0.9rem' }}>
                <FiMapPin style={{ color: 'var(--accent)' }} /> India (Remote Worldwide)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text2)', fontSize: '0.9rem' }}>
                <FiBriefcase style={{ color: 'var(--accent)' }} /> 3+ Years Experience
              </span>
            </div>
            <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '16px', fontSize: '1.05rem' }}>
              I'm a passionate Full Stack Web Developer from India, specializing in building
              high-performance, scalable web applications for businesses worldwide.
            </p>
            <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '32px' }}>
              With expertise in <strong style={{ color: 'var(--text)' }}>React.js, Node.js, MongoDB, and Python</strong>,
              I help startups and businesses transform their ideas into powerful digital products.
              I've worked with clients from USA, UK, Canada, Australia, and more.
            </p>
            <div className="about-actions">
              <Link to="/contact" className="btn btn-primary">
                Hire Me <FiArrowRight />
              </Link>
              <a href="/Shivam%20maurya.pdf" download className="btn btn-outline">
                <FiDownload /> Download CV
              </a>
            </div>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '100px' }}
        >
          <div className="grid-4">
            {achievements.map((a, i) => (
              <motion.div key={i} className="card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{a.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{a.title}</div>
                <div style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '4px' }}>{a.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '100px' }}>
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-subtitle">Technologies I work with daily</p>
          <div className="about-skills-grid">
            {skills.map((skill, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: skill.color, fontWeight: 600 }}>
                    {skill.icon} {skill.name}
                  </div>
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

        {/* Experience Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '80px' }}>
          <h2 className="section-title">Experience & Education</h2>
          <p className="section-subtitle">My professional journey</p>
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

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', padding: '60px 40px', background: 'var(--card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Let's build something great together</h2>
          <p style={{ color: 'var(--text2)', marginBottom: '32px', fontSize: '1.05rem' }}>
            I'm currently available for new projects. Let's discuss your idea.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">Get In Touch <FiArrowRight /></Link>
            <Link to="/projects" className="btn btn-outline">View My Work</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
