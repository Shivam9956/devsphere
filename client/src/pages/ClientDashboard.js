import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiClock, FiCheckCircle, FiAlertCircle, FiRefreshCw, FiMessageSquare, FiPlus, FiSend, FiUser } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../App';
import toast from 'react-hot-toast';
import { PayPalButtons } from '@paypal/react-paypal-js';

const currencyMap = {
  'IN': { symbol: '₹', rate: 83.5, payment: 'razorpay' },
  'US': { symbol: '$', rate: 1, payment: 'paypal' },
  'GB': { symbol: '£', rate: 0.79, payment: 'paypal' },
  'AU': { symbol: 'A$', rate: 1.53, payment: 'paypal' },
  'CA': { symbol: 'C$', rate: 1.36, payment: 'paypal' },
  'AE': { symbol: 'AED', rate: 3.67, payment: 'paypal' },
  'SG': { symbol: 'S$', rate: 1.34, payment: 'paypal' },
  'DE': { symbol: '€', rate: 0.92, payment: 'paypal' },
  'FR': { symbol: '€', rate: 0.92, payment: 'paypal' },
  'BD': { symbol: '৳', rate: 110, payment: 'paypal' },
  'PK': { symbol: '₨', rate: 278, payment: 'paypal' },
  'NP': { symbol: 'Rs', rate: 133, payment: 'paypal' },
  'NZ': { symbol: 'NZ$', rate: 1.63, payment: 'paypal' },
};

const statusConfig = {
  'Pending': { color: '#f59e0b', icon: <FiClock />, bg: 'rgba(245,158,11,0.1)' },
  'In Progress': { color: '#6366f1', icon: <FiRefreshCw />, bg: 'rgba(99,102,241,0.1)' },
  'Review': { color: '#06b6d4', icon: <FiAlertCircle />, bg: 'rgba(6,182,212,0.1)' },
  'Completed': { color: '#10b981', icon: <FiCheckCircle />, bg: 'rgba(16,185,129,0.1)' }
};

const stages = [
  { key: 'Pending',     num: '01', label: 'Discovery',   desc: 'We discuss your requirements, goals, and vision for the project.' },
  { key: 'In Progress', num: '02', label: 'Planning',     desc: 'I create a detailed project plan with timeline and milestones.' },
  { key: 'Review',      num: '03', label: 'Development',  desc: 'Building your project with regular updates and progress reports.' },
  { key: 'Completed',   num: '04', label: 'Launch',       desc: 'Testing, deployment, and handover with full documentation.' }
];

export default function ClientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  
  // Projects state
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const userCurrency = currencyMap[user?.country] || { symbol: '$', rate: 1, payment: 'paypal' };
  const [payMethod, setPayMethod] = useState('paypal');
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedProjectForPay, setSelectedProjectForPay] = useState(null);
  const [payLoading, setPayLoading] = useState(false);

  // Support Tickets state
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [replyText, setReplyText] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  useEffect(() => {
    if (userCurrency) {
      setPayMethod(userCurrency.payment);
    }
  }, [user?.country]);

  useEffect(() => {
    api.get('/clients/my-projects').then(r => {
      setProjects(r.data);
      if (r.data.length > 0) setSelected(r.data[0]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const fetchTickets = async () => {
    setTicketsLoading(true);
    try {
      const res = await api.get('/support');
      setTickets(res.data);
      if (res.data.length > 0) {
        setSelectedTicket(prev => res.data.find(t => t._id === prev?._id) || res.data[0]);
      }
    } catch (err) {
      toast.error('Failed to load support tickets');
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'support') {
      fetchTickets();
    }
  }, [activeTab]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      return toast.error('Subject and message are required');
    }
    setSubmittingTicket(true);
    try {
      await api.post('/support', {
        subject: ticketSubject,
        message: ticketMessage
      });
      toast.success('Support ticket created successfully!');
      setTicketSubject('');
      setTicketMessage('');
      setShowNewTicketModal(false);
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const res = await api.post(`/support/${selectedTicket._id}/message`, {
        text: replyText
      });
      setReplyText('');
      setSelectedTicket(res.data);
      setTickets(prev => prev.map(t => t._id === res.data._id ? res.data : t));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    }
  };

  const handlePay = async (projectId, method) => {
    setPayLoading(true);
    try {
      if (method === 'paypal') {
        const res = await api.post('/payments/paypal/create-order', { projectId });
        if (res.data.approveUrl) window.location.href = res.data.approveUrl;
        else toast.error('PayPal error. Try again.');
      } else if (method === 'razorpay') {
        const res = await api.post('/payments/razorpay/create-order', { projectId });
        const { orderId, amount, currency, keyId, planName } = res.data;
        const options = {
          key: keyId, amount, currency,
          name: 'DevSphere Global', description: `Project: ${planName}`,
          order_id: orderId,
          prefill: { name: user?.name, email: user?.email },
          theme: { color: '#6366f1' },
          handler: async (response) => {
            await api.post('/payments/razorpay/verify', {
              ...response,
              projectId,
              email: user?.email,
              name: user?.name
            });
            toast.success('Payment successful!');
            window.location.href = '/payment/success';
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error('Payment method not supported');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container section">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p style={{ color: 'var(--text2)' }}>Track your project progress and contact support here.</p>
        </motion.div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <button 
            onClick={() => setActiveTab('projects')}
            style={{ 
              padding: '10px 20px', 
              borderRadius: '10px', 
              border: '1.5px solid', 
              borderColor: activeTab === 'projects' ? 'var(--accent)' : 'transparent', 
              background: activeTab === 'projects' ? 'rgba(99,102,241,0.1)' : 'transparent', 
              color: activeTab === 'projects' ? 'var(--accent)' : 'var(--text2)', 
              fontWeight: 600, 
              cursor: 'pointer', 
              transition: 'var(--transition)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📁 My Projects
          </button>
          <button 
            onClick={() => setActiveTab('support')}
            style={{ 
              padding: '10px 20px', 
              borderRadius: '10px', 
              border: '1.5px solid', 
              borderColor: activeTab === 'support' ? 'var(--accent)' : 'transparent', 
              background: activeTab === 'support' ? 'rgba(99,102,241,0.1)' : 'transparent', 
              color: activeTab === 'support' ? 'var(--accent)' : 'var(--text2)', 
              fontWeight: 600, 
              cursor: 'pointer', 
              transition: 'var(--transition)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            💬 Support Tickets
          </button>
        </div>

        {/* Tab 1: Projects */}
        {activeTab === 'projects' && (
          <div>
            {loading ? (
              <div className="spinner" />
            ) : projects.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
                <h3 style={{ marginBottom: '8px' }}>No projects yet</h3>
                <p style={{ color: 'var(--text2)' }}>Your projects will appear here once assigned by the admin.</p>
              </div>
            ) : (
              <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
                {/* Project List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {projects.map(p => {
                    const sc = statusConfig[p.status] || statusConfig['Pending'];
                    return (
                      <div
                        key={p._id}
                        onClick={() => setSelected(p)}
                        className="card"
                        style={{
                          cursor: 'pointer',
                          borderColor: selected?._id === p._id ? 'var(--accent)' : 'var(--border)',
                          background: selected?._id === p._id ? 'rgba(99,102,241,0.05)' : 'var(--card)',
                          padding: '16px'
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.95rem' }}>{p.title}</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: sc.color, background: sc.bg, padding: '4px 10px', borderRadius: '50px', width: 'fit-content' }}>
                            {sc.icon} {p.status}
                          </div>
                          {p.budget && (
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                              ${p.budget.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Project Detail */}
                {selected && (
                  <motion.div key={selected._id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="card" style={{ padding: '32px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '6px' }}>{selected.title}</h2>
                          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{selected.description}</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: statusConfig[selected.status]?.color, background: statusConfig[selected.status]?.bg, padding: '6px 14px', borderRadius: '50px' }}>
                          {statusConfig[selected.status]?.icon} {selected.status}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontWeight: 600 }}>Overall Progress</span>
                          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{selected.progress}%</span>
                        </div>
                        <div style={{ height: '10px', background: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
                          <motion.div
                            style={{ height: '100%', background: 'var(--gradient)', borderRadius: '5px' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${selected.progress}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>

                      {/* Payment Details & Invoice */}
                      {selected.budget && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: 'var(--bg2)',
                          padding: '16px 20px',
                          borderRadius: '12px',
                          marginBottom: '24px',
                          border: '1px solid var(--border)'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {selected.status === 'Completed' ? 'Final Project Price' : 'Budget & Payment'}
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)', marginTop: '4px' }}>
                              ${selected.budget.toLocaleString()} 
                              <span style={{
                                marginLeft: '12px',
                                fontSize: '0.75rem',
                                padding: '3px 10px',
                                borderRadius: '50px',
                                background: selected.paymentStatus === 'Paid' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                color: selected.paymentStatus === 'Paid' ? '#10b981' : '#f59e0b',
                                fontWeight: 600
                              }}>
                                {selected.paymentStatus || 'Unpaid'}
                              </span>
                            </div>
                          </div>

                          {/* Invoice download link if paid, otherwise Pay Now button */}
                          {selected.paymentStatus === 'Paid' ? (
                            <a
                              href={`/invoice/${selected._id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline"
                              style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              📄 Download Invoice
                            </a>
                          ) : (
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setSelectedProjectForPay(selected);
                                setShowPayModal(true);
                              }}
                              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                            >
                              💸 Pay Now
                            </button>
                          )}
                        </div>
                      )}

                      {/* Stage Cards */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {stages.map((stage, i) => {
                          const steps = stages.map(s => s.key);
                          const currentIdx = steps.indexOf(selected.status);
                          const isDone = i < currentIdx;
                          const isActive = i === currentIdx;
                          return (
                            <div key={stage.key} style={{
                              padding: '20px 16px',
                              borderRadius: '14px',
                              border: `1.5px solid ${isActive ? 'var(--accent)' : isDone ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
                              background: isActive ? 'rgba(99,102,241,0.08)' : isDone ? 'rgba(16,185,129,0.05)' : 'var(--bg2)',
                              transition: 'all 0.3s',
                              position: 'relative'
                            }}>
                              {isDone && (
                                <div style={{ position: 'absolute', top: 10, right: 10, color: '#10b981', fontSize: '1rem' }}>
                                  <FiCheckCircle />
                                </div>
                              )}
                              <div style={{
                                fontSize: '1.6rem', fontWeight: 800,
                                color: isActive ? 'var(--accent)' : isDone ? '#10b981' : 'var(--text2)',
                                marginBottom: '8px'
                              }}>{stage.num}</div>
                              <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '0.95rem', color: isActive ? 'var(--text)' : isDone ? 'var(--text)' : 'var(--text2)' }}>
                                {stage.label}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text2)', lineHeight: 1.5 }}>
                                {stage.desc}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Updates */}
                    {selected.updates?.length > 0 && (
                      <div className="card" style={{ padding: '28px' }}>
                        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FiMessageSquare style={{ color: 'var(--accent)' }} /> Project Updates
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {[...selected.updates].reverse().map((u, i) => (
                            <div key={i} style={{ padding: '14px', background: 'var(--bg2)', borderRadius: '10px', borderLeft: '3px solid var(--accent)' }}>
                              <p style={{ fontSize: '0.9rem', marginBottom: '6px' }}>{u.message}</p>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
                                {new Date(u.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Support Tickets */}
        {activeTab === 'support' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Support Tickets</h2>
                <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Chat directly with our team regarding your projects.</p>
              </div>
              <button className="btn btn-primary" onClick={() => setShowNewTicketModal(true)} style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                <FiPlus /> Create Ticket
              </button>
            </div>

            {ticketsLoading && tickets.length === 0 ? (
              <div className="spinner" />
            ) : tickets.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💬</div>
                <h3 style={{ marginBottom: '8px' }}>No support tickets yet</h3>
                <p style={{ color: 'var(--text2)' }}>Have questions? Create a ticket and start chatting with our team.</p>
              </div>
            ) : (
              <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
                {/* Ticket List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto', paddingRight: '4px' }}>
                  {tickets.map(t => {
                    const isSelected = selectedTicket?._id === t._id;
                    let statusColor = 'var(--accent)';
                    let statusBg = 'rgba(99,102,241,0.1)';
                    if (t.status === 'In Progress') {
                      statusColor = 'var(--yellow)';
                      statusBg = 'rgba(245,158,11,0.1)';
                    } else if (t.status === 'Closed') {
                      statusColor = 'var(--green)';
                      statusBg = 'rgba(16,185,129,0.1)';
                    }

                    return (
                      <div
                        key={t._id}
                        onClick={() => setSelectedTicket(t)}
                        className="card"
                        style={{
                          cursor: 'pointer',
                          borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                          background: isSelected ? 'rgba(99,102,241,0.05)' : 'var(--card)',
                          padding: '16px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {t.subject}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: statusColor, background: statusBg, padding: '3px 10px', borderRadius: '50px', fontWeight: 600 }}>
                            {t.status}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
                            {new Date(t.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Chat Interface */}
                {selectedTicket && (
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '600px', padding: '24px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{selectedTicket.subject}</h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Ticket ID: {selectedTicket._id}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '0.8rem',
                          padding: '4px 12px',
                          borderRadius: '50px',
                          fontWeight: 600,
                          color: selectedTicket.status === 'Closed' ? 'var(--green)' : selectedTicket.status === 'In Progress' ? 'var(--yellow)' : 'var(--accent)',
                          background: selectedTicket.status === 'Closed' ? 'rgba(16,185,129,0.1)' : selectedTicket.status === 'In Progress' ? 'rgba(245,158,11,0.1)' : 'rgba(99,102,241,0.1)'
                        }}>
                          ● {selectedTicket.status}
                        </span>
                      </div>
                    </div>

                    {/* Messages body */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px', marginBottom: '16px' }}>
                      {selectedTicket.messages.map((m, idx) => {
                        const isAdmin = m.sender !== user._id;
                        return (
                          <div
                            key={idx}
                            style={{
                              alignSelf: isAdmin ? 'flex-start' : 'flex-end',
                              maxWidth: '75%',
                              background: isAdmin ? 'var(--card2)' : 'var(--accent)',
                              color: isAdmin ? 'var(--text)' : 'white',
                              padding: '12px 18px',
                              borderRadius: '14px',
                              borderBottomLeftRadius: isAdmin ? '2px' : '14px',
                              borderBottomRightRadius: isAdmin ? '14px' : '2px',
                              boxShadow: 'var(--shadow-sm)',
                              border: isAdmin ? '1px solid var(--border2)' : 'none'
                            }}
                          >
                            <div style={{ fontSize: '0.88rem', wordBreak: 'break-word', lineHeight: 1.5 }}>{m.text}</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'right', marginTop: '6px' }}>
                              {isAdmin ? 'Admin' : 'You'} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chat Input */}
                    {selectedTicket.status !== 'Closed' ? (
                      <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '10px' }}>
                        <input
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Type your message here..."
                          style={{ flex: 1 }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', borderRadius: 'var(--radius)' }}>
                          <FiSend size={16} /> Send
                        </button>
                      </form>
                    ) : (
                      <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '0.9rem', padding: '10px', background: 'var(--bg2)', borderRadius: '10px' }}>
                        This support ticket has been closed. Please create a new ticket if you need further assistance.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, padding: '20px'
        }} onClick={e => { if (e.target === e.currentTarget) setShowNewTicketModal(false); }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ width: '100%', maxWidth: 500, padding: '32px', position: 'relative' }}
          >
            <h3 style={{ marginBottom: '4px', fontWeight: 700 }}>Create Support Ticket</h3>
            <button onClick={() => setShowNewTicketModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text2)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Fill in the details below to open a ticket with our support team.
            </p>

            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Subject *</label>
                <input 
                  value={ticketSubject}
                  onChange={e => setTicketSubject(e.target.value)}
                  placeholder="e.g. Issue with database integration"
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Message *</label>
                <textarea 
                  value={ticketMessage}
                  onChange={e => setTicketMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  rows={5}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="btn btn-primary" disabled={submittingTicket} style={{ flex: 1, justifyContent: 'center' }}>
                  {submittingTicket ? 'Submitting...' : 'Submit Ticket'}
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowNewTicketModal(false)}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayModal && selectedProjectForPay && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, padding: '20px'
        }} onClick={e => { if (e.target === e.currentTarget) setShowPayModal(false); }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ width: '100%', maxWidth: 480, padding: '32px', position: 'relative' }}
          >
            <h3 style={{ marginBottom: '4px', fontWeight: 700 }}>Project Payment</h3>
            <button onClick={() => setShowPayModal(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'var(--text2)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            <p style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
              Project: {selectedProjectForPay.title} — ${selectedProjectForPay.budget?.toLocaleString()}
            </p>
            
            {/* Payment Method */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text2)', marginBottom: '10px' }}>Choose payment method:</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {[
                  { id: 'paypal', label: '🅿️ PayPal', sub: 'Worldwide' },
                  { id: 'razorpay', label: '🇮🇳 Razorpay', sub: 'India' }
                ].map(m => (
                  <button key={m.id} onClick={() => setPayMethod(m.id)}
                    style={{
                      padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600,
                      border: `2px solid ${payMethod === m.id ? 'var(--accent)' : 'var(--border2)'}`,
                      background: payMethod === m.id ? 'rgba(99,102,241,0.12)' : 'var(--card2)',
                      color: payMethod === m.id ? 'var(--accent)' : 'var(--text2)',
                      cursor: 'pointer', fontFamily: 'inherit', transition: 'var(--transition)'
                    }}
                  >
                    {m.label} <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>({m.sub})</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" onClick={() => handlePay(selectedProjectForPay._id, payMethod)}
                  disabled={payLoading} style={{ flex: 1, justifyContent: 'center' }}>
                  {payLoading ? 'Processing...' : payMethod === 'paypal' ? '🅿️ Pay with PayPal' : '🇮🇳 Pay with Razorpay'}
                </button>
                <button className="btn btn-outline" onClick={() => setShowPayModal(false)}>Cancel</button>
              </div>

              {/* PayPal Smart Button */}
              {payMethod === 'paypal' && (
                <div style={{ marginTop: '16px' }}>
                  <PayPalButtons
                    style={{ layout: 'vertical', color: 'blue', shape: 'pill', label: 'pay' }}
                    createOrder={async () => {
                      const res = await api.post('/payments/paypal/create-order', { projectId: selectedProjectForPay._id });
                      return res.data.orderId;
                    }}
                    onApprove={async (data) => {
                      setPayLoading(true);
                      try {
                        await api.post(`/payments/paypal/capture/${data.orderID}`, {
                          email: user?.email,
                          name: user?.name
                        });
                        toast.success('Payment successful! Thank you.');
                        window.location.href = '/payment/success';
                      } catch (err) {
                        toast.error('Payment capture failed. Please check with support.');
                      } finally {
                        setPayLoading(false);
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal error:', err);
                      toast.error('PayPal payment failed. Please try again.');
                    }}
                    onCancel={() => toast.error('Payment cancelled.')}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
