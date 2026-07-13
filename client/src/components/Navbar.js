import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useTheme, useAuth } from '../App';
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
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                <FiUser size={14} style={{ marginRight: '6px' }} /> 
                <span>{user.role === 'admin' ? 'Admin Panel' : 'Dashboard'} ({(user.name || 'User').split(' ')[0]})</span>
              </Link>
              <button className="icon-btn" onClick={handleLogout} aria-label="Logout">
                <FiLogOut />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '10px 22px' }}>
              Client Login
            </Link>
          )}

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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
