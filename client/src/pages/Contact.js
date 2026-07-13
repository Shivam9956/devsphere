import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMapPin, FiSend, FiClock, FiCheck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../api/axios';

const contactInfo = [
  { icon: <FiMail />, label: 'Email', value: 'devsphereglobal@gmail.com', href: 'mailto:devsphereglobal@gmail.com', color: '#6366f1' },
  { icon: <FaWhatsapp />, label: 'WhatsApp', value: '+91 83539 49006', href: 'https://wa.me/918353949006', color: '#25D366' },
  { icon: <FiMapPin />, label: 'Location', value: 'India · Available Worldwide', href: null, color: '#06b6d4' },
  { icon: <FiClock />, label: 'Response Time', value: 'Within 24 hours', href: null, color: '#f59e0b' }
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success("Message sent! I'll get back to you within 24 hours.");
      setForm({ name: '', email: '', subject: '', message: '' });
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container section">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '16px' }}>Contact</div>
          <h1 className="section-title" style={{ marginBottom: '16px' }}>Get In Touch</h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            Have a project in mind? Let's talk about it.
          </p>
        </motion.div>

        <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '56px', alignItems: 'start' }}>

          {/* Left: Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '14px', fontWeight: 700 }}>Let's work together</h2>
            <p style={{ color: 'var(--text2)', lineHeight: 1.85, marginBottom: '36px', fontSize: '0.95rem' }}>
              I'm available for freelance projects worldwide. Whether you need a simple website or a complex web application, I'm here to help.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '36px' }}>
              {contactInfo.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
                >
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
                </motion.div>
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
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <form onSubmit={handleSubmit} className="card" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label htmlFor="contact-name" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                    Your Name *
                  </label>
                  <input id="contact-name" name="name" value={form.name} onChange={handleChange} placeholder="John Smith" required />
                </div>
                <div>
                  <label htmlFor="contact-email" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                    Email Address *
                  </label>
                  <input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                  Subject
                </label>
                <input id="contact-subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Project Inquiry" />
              </div>

              <div>
                <label htmlFor="contact-message" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)' }}>
                  Message *
                </label>
                <textarea id="contact-message" name="message" value={form.message} onChange={handleChange}
                  placeholder="Tell me about your project, timeline, and budget..." required rows={6}
                  style={{ resize: 'vertical', minHeight: '140px' }} />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading || sent}
                style={{ alignSelf: 'flex-start', minWidth: '160px', justifyContent: 'center' }}>
                {sent
                  ? <><FiCheck size={15} /> Message Sent!</>
                  : loading
                    ? 'Sending...'
                    : <><FiSend size={15} /> Send Message</>
                }
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
