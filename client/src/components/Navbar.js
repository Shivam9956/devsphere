import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiZap } from 'react-icons/fi';
import { useTheme, useAuth, useAudit } from '../App';
import './Navbar.css';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Projects', path: '/projects' },
  { label: 'Services', path: '/services' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' }
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { openAuditModal } = useAudit();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="navbar-wrapper">
      {/* Top Global Announcement Bar */}
      <div className="top-announcement-bar" onClick={openAuditModal} style={{ cursor: 'pointer' }}>
        <div className="container announcement-inner">
          <div className="announcement-left">
            <span className="announcement-badge" style={{ cursor: 'pointer' }}>
              <FiZap size={12} /> FREE AUDIT
            </span>
            <span className="announcement-text">
              Claim a <strong>100% Free Website Speed, UI & SEO Audit</strong> (Worth $299) — Delivered in 24h
            </span>
          </div>
          <button onClick={e => { e.stopPropagation(); openAuditModal(); }} className="announcement-cta" aria-label="Claim Free Audit">
            Get Free Report →
          </button>
        </div>
      </div>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Link to="/" className="nav-logo">
            <span className="gradient-text">DevSphere</span> Global
          </Link>

        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.path}>
              <Link to={link.path} className={location.pathname === link.path ? 'active' : ''}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          {user ? (
            <div className="nav-user">
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="icon-btn" title={user.role === 'admin' ? 'Admin Panel' : 'Dashboard'} aria-label="Dashboard">
                <FiUser size={16} />
              </Link>
              <button className="icon-btn" onClick={handleLogout} title="Logout" aria-label="Logout">
                <FiLogOut />
              </button>
            </div>
          ) : (
            <Link to="/login" className="icon-btn" title="Client Login" aria-label="Login">
              <FiUser size={16} />
            </Link>
          )}

          <Link to="/contact" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
            Start a Project
          </Link>

          <button className="icon-btn mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className={location.pathname === link.path ? 'active' : ''}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                  <FiUser size={14} style={{ marginRight: 8 }} /> Dashboard
                </Link>
                <button onClick={handleLogout} style={{ color: 'var(--red)' }}>
                  <FiLogOut size={14} style={{ marginRight: 8 }} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                Client Login →
              </Link>
            )}
            <div style={{ padding: '12px 24px' }}>
              <button
                onClick={() => { setMenuOpen(false); openAuditModal(); }}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '0.88rem' }}
              >
                🎁 Claim Free Website Audit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  </header>
  );
}
