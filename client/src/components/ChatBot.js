import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX, FiMessageCircle, FiMinimize2, FiExternalLink } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const INITIAL_MESSAGE = {
  role: 'model',
  text: "Hi! 👋 I'm DevSphere's AI assistant.\n\nI can help you with:\n• Pricing & plans\n• Project demos\n• Custom quotes\n\nWhat are you looking to build?"
};

const QUICK_REPLIES = [
  { label: '💰 Pricing', msg: 'What are your pricing plans?' },
  { label: '🎨 See Projects', msg: 'Show me your portfolio projects' },
  { label: '🛒 E-commerce', msg: 'I need an e-commerce website' },
  { label: '🚀 Web App', msg: 'I need a custom web application' },
  { label: '📞 Contact', msg: 'How can I contact you?' },
  { label: '⏱️ Timeline', msg: 'How long does delivery take?' },
];

// Detect if message contains a URL and render it as link
function MessageBubble({ text, role }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <div style={{
      maxWidth: '85%',
      padding: '10px 14px',
      borderRadius: role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
      background: role === 'user'
        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
        : 'var(--bg2)',
      color: role === 'user' ? 'white' : 'var(--text)',
      fontSize: '0.875rem',
      lineHeight: 1.6,
      border: role === 'model' ? '1px solid var(--border)' : 'none',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word'
    }}>
      {parts.map((part, i) =>
        urlRegex.test(part)
          ? <a key={i} href={part} target="_blank" rel="noreferrer"
              style={{ color: role === 'user' ? '#c7d2fe' : 'var(--accent)', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              {part} <FiExternalLink size={11} />
            </a>
          : <span key={i}>{part}</span>
      )}
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', text: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const history = newMessages.slice(1, -1).map(m => ({ role: m.role, text: m.text }));
      const { data } = await api.post('/chat', { message: trimmed, history });
      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, something went wrong. Please contact us at devsphereglobal@gmail.com 😊" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const showQuickReplies = messages.length <= 2;

  return (
    <div className="chatbot-container" style={{ position: 'fixed', bottom: '100px', right: '30px', zIndex: 998 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="chatbot-window"
            style={{
              width: '350px',
              height: '520px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              marginBottom: '12px'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem', color: 'white'
                }}>
                  <RiRobot2Line />
                </div>
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>DevSphere AI</div>
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                    Online • Typically replies instantly
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => { navigate('/contact'); setOpen(false); }}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '5px 10px', borderRadius: '8px', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Contact Us
                </button>
                <button onClick={() => setOpen(false)} style={{
                  background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white',
                  width: 30, height: 30, borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1rem'
                }}>
                  <FiMinimize2 />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  {msg.role === 'model' && (
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontSize: '0.75rem', flexShrink: 0, marginRight: '7px', alignSelf: 'flex-end'
                    }}>
                      <RiRobot2Line />
                    </div>
                  )}
                  <MessageBubble text={msg.text} role={msg.role} />
                </motion.div>
              ))}

              {loading && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '7px' }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', flexShrink: 0
                  }}>
                    <RiRobot2Line />
                  </div>
                  <div style={{
                    padding: '10px 16px', borderRadius: '16px 16px 16px 4px',
                    background: 'var(--bg2)', border: '1px solid var(--border)',
                    display: 'flex', gap: '4px', alignItems: 'center'
                  }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{
                        width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
                        display: 'inline-block',
                        animation: `chatBounce 1s ease-in-out ${i * 0.15}s infinite`
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Replies */}
            {showQuickReplies && (
              <div style={{ padding: '0 12px 8px', display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
                {QUICK_REPLIES.map(q => (
                  <button key={q.label} onClick={() => sendMessage(q.msg)}
                    style={{
                      padding: '5px 11px', borderRadius: '20px', fontSize: '0.76rem',
                      background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                      color: 'var(--accent)', cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.2s', whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={e => e.target.style.background = 'rgba(99,102,241,0.2)'}
                    onMouseLeave={e => e.target.style.background = 'rgba(99,102,241,0.1)'}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} style={{
              padding: '10px 14px',
              borderTop: '1px solid var(--border)',
              display: 'flex', gap: '8px', alignItems: 'center',
              flexShrink: 0
            }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about pricing, projects..."
                disabled={loading}
                style={{
                  flex: 1, padding: '9px 14px', borderRadius: '50px',
                  fontSize: '0.875rem', border: '1px solid var(--border)',
                  background: 'var(--bg2)', color: 'var(--text)', outline: 'none'
                }}
              />
              <button type="submit" disabled={!input.trim() || loading} style={{
                width: 36, height: 36, borderRadius: '50%', border: 'none',
                background: input.trim() && !loading ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--border)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                fontSize: '0.9rem', transition: 'all 0.2s', flexShrink: 0
              }}>
                <FiSend />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 58, height: 58, borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white', fontSize: '1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(99,102,241,0.5)',
          cursor: 'pointer', position: 'relative'
        }}
        aria-label="Open AI Chat"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><FiX /></motion.span>
            : <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><FiMessageCircle /></motion.span>
          }
        </AnimatePresence>

        {/* Unread badge */}
        {!open && unread > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{
              position: 'absolute', top: -3, right: -3,
              width: 18, height: 18, borderRadius: '50%',
              background: '#ef4444', border: '2px solid var(--bg)',
              fontSize: '0.65rem', fontWeight: 700, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {unread}
          </motion.span>
        )}

        {/* Pulse ring when closed */}
        {!open && (
          <span style={{
            position: 'absolute', inset: -4, borderRadius: '50%',
            border: '2px solid rgba(99,102,241,0.4)',
            animation: 'chatPulse 2s ease-out infinite'
          }} />
        )}
      </motion.button>

      <style>{`
        @keyframes chatBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes chatPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @media (max-width: 480px) {
          .chatbot-container {
            right: 12px !important;
            left: 12px !important;
            bottom: 80px !important;
          }
          .chatbot-window {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
