import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { FiMail, FiMapPin, FiArrowUpRight } from 'react-icons/fi';

const socials = [
  { icon: <FaGithub />, href: 'https://github.com/Shivam9956', label: 'GitHub' },
  { icon: <FaLinkedin />, href: 'https://www.linkedin.com/in/shivam-maurya-023788305', label: 'LinkedIn' },
  { icon: <FaTwitter />, href: 'https://x.com/DevSphereGloble', label: 'Twitter' },
  { icon: <FaInstagram />, href: 'https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=h5divp5', label: 'Instagram' },
  { icon: <FaWhatsapp />, href: 'https://wa.me/918353949006', label: 'WhatsApp' }
];
const quickLinks = [
  ['Home', '/'], ['About', '/about'], ['Projects', '/projects'], ['Services', '/services'],
  ['Pricing', '/pricing'], ['Blog', '/blog'], ['Contact', '/contact']
];

const services = [
  'Business Website', 'E-commerce Website',
  'Landing Page', 'Website Maintenance & SEO'
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
      <div className="container" style={{ padding: '64px 24px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.4fr', gap: '48px', marginBottom: '48px' }}>

          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>
                <span className="gradient-text">DevSphere</span>
                <span style={{ color: 'var(--text)' }}> Global</span>
              </div>
            </Link>
            <p style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.75, marginBottom: '24px', maxWidth: '280px' }}>
              Building high-performance websites and web applications for global clients. From idea to launch.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {socials.map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                  style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', fontSize: '1rem', transition: 'var(--transition)' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {quickLinks.map(([label, path]) => (
                <li key={path}>
                  <Link to={path} style={{ color: 'var(--text2)', fontSize: '0.9rem', transition: 'var(--transition)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.paddingLeft = '4px'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.paddingLeft = '0'; }}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text)' }}>Services</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {services.map(s => <li key={s} style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{s}</li>)}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '20px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text)' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <a href="mailto:devsphereglobal@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text2)', fontSize: '0.88rem', transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
              >
                <FiMail size={15} style={{ flexShrink: 0 }} /> devsphereglobal@gmail.com
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text2)', fontSize: '0.88rem' }}>
                <FiMapPin size={15} style={{ flexShrink: 0 }} /> India - Available Worldwide
              </div>
            </div>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
              Start a Project <FiArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ color: 'var(--text3)', fontSize: '0.83rem' }}>
            {new Date().getFullYear()} DevSphere Global. All rights reserved.
          </p>
          <p style={{ color: 'var(--text3)', fontSize: '0.83rem' }}>Crafted with React.js + Node.js</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { footer .container > div:first-child { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 640px) { footer .container > div:first-child { grid-template-columns: 1fr !important; gap: 32px !important; } }
      `}</style>
    </footer>
  );
}
