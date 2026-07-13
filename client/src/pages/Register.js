import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiBriefcase, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../App';

const getApiUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl.replace('/api', '');
  }
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:5000`;
  }
  return 'http://localhost:5000';
};
const API_URL = getApiUrl();

const countries = [
  { code: '', name: 'Select your country', flag: '🌍' },
  { code: 'IN', name: 'India', flag: '🇮🇳', payment: 'razorpay' },
  { code: 'US', name: 'United States', flag: '🇺🇸', payment: 'paypal' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', payment: 'paypal' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', payment: 'paypal' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', payment: 'paypal' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', payment: 'paypal' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', payment: 'paypal' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', payment: 'paypal' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', payment: 'paypal' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', payment: 'paypal' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', payment: 'paypal' },
  { code: 'FR', name: 'France', flag: '🇫🇷', payment: 'paypal' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', payment: 'paypal' },
  { code: 'OTHER', name: 'Other', flag: '🌍', payment: 'paypal' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '', phone: '', country: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (id, label, icon, props) => (
    <div>
      <label htmlFor={id} style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none', display: 'flex' }}>
          {icon}
        </span>
        <input id={id} {...props} style={{ paddingLeft: '42px', ...props.style }} />
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px 24px 40px',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '15%', left: '8%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.07), transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06), transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '480px', position: 'relative' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link to="/" style={{ display: 'inline-block', marginBottom: '20px' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="gradient-text">DevSphere</span>
              <span style={{ color: 'var(--text)' }}> Global</span>
            </div>
          </Link>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Create Account</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.92rem' }}>Register to track your project progress</p>
        </div>

        <form onSubmit={handleSubmit} className="card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {field('reg-name', 'Full Name *', <FiUser size={15} />, {
              value: form.name,
              onChange: e => setForm({ ...form, name: e.target.value }),
              placeholder: 'John Smith', required: true
            })}
            {field('reg-company', 'Company', <FiBriefcase size={15} />, {
              value: form.company,
              onChange: e => setForm({ ...form, company: e.target.value }),
              placeholder: 'Acme Inc.'
            })}
          </div>

          {field('reg-email', 'Email Address *', <FiMail size={15} />, {
            type: 'email', value: form.email,
            onChange: e => setForm({ ...form, email: e.target.value }),
            placeholder: 'your@email.com', required: true
          })}

          {field('reg-phone', 'Phone Number', <FiPhone size={15} />, {
            value: form.phone,
            onChange: e => setForm({ ...form, phone: e.target.value }),
            placeholder: '+1 234 567 8900'
          })}

          <div>
            <label htmlFor="reg-country" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
              Country *
            </label>
            <select
              id="reg-country"
              value={form.country}
              onChange={e => setForm({ ...form, country: e.target.value })}
              required
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="reg-password" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
              Password *
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
              <input
                id="reg-password"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Min 6 characters"
                required minLength={6}
                style={{ paddingLeft: '42px', paddingRight: '44px' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {form.password && (
              <div style={{ marginTop: '6px', display: 'flex', gap: '4px' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{
                    flex: 1, height: 3, borderRadius: 2,
                    background: form.password.length >= i * 2
                      ? i <= 1 ? '#ef4444' : i <= 2 ? '#f59e0b' : i <= 3 ? '#10b981' : '#6366f1'
                      : 'var(--border)'
                  }} />
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ justifyContent: 'center', marginTop: '4px' }}>
            {loading ? 'Creating account...' : <> Create Account <FiArrowRight size={15} /></>}
          </button>

          <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: '0.88rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign in</Link>
          </p>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ color: 'var(--text3)', fontSize: '0.8rem', fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Google Sign Up */}
          <a
            href={`${API_URL}/api/auth/google`}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '12px 20px', borderRadius: '50px',
              background: 'var(--card2)', border: '1.5px solid var(--border2)',
              color: 'var(--text)', fontWeight: 600, fontSize: '0.92rem',
              transition: 'var(--transition)', textDecoration: 'none'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--card2)'; }}
          >
            <FcGoogle size={20} />
            Sign up with Google
          </a>
        </form>
      </motion.div>
    </div>
  );
}
