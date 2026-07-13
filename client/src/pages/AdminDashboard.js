import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiMail, FiUsers, FiFolder, FiMessageSquare, FiCheck, FiX, FiSend } from 'react-icons/fi';
import { iconGroups, getIcon } from '../utils/iconMap';
import toast from 'react-hot-toast';
import api from '../api/axios';

const tabs = ['Projects', 'Services', 'Earnings', 'Client Projects', 'Messages', 'Testimonials', 'Blog', 'Newsletter', 'Support Tickets', 'Pricing'];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Projects');
  const [projects, setProjects] = useState([]);
  const [clientProjects, setClientProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [clients, setClients] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [earningStats, setEarningStats] = useState({ total: 0, monthly: 0, lastMonth: 0, yearly: 0, pending: 0, growth: 0 });
  const [showEarningForm, setShowEarningForm] = useState(false);
  const [earningForm, setEarningForm] = useState({ title: '', amount: '', client: '', category: 'Website Development', status: 'Received', date: new Date().toISOString().split('T')[0], note: '' });
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editService, setEditService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '', description: '', icon: 'FiCode', color: '#6366f1', features: '', order: 0, active: true
  });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [showClientProjectForm, setShowClientProjectForm] = useState(false);
  const [updateModal, setUpdateModal] = useState(null);
  const [updateMsg, setUpdateMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({ title: '', slug: '', excerpt: '', content: '', category: 'Web Development', published: false });
  const [subscribers, setSubscribers] = useState([]);
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ subject: '', message: '' });

  const [projectForm, setProjectForm] = useState({
    title: '', description: '', techStack: '', category: 'Web App',
    liveUrl: '', githubUrl: '', featured: false
  });

  const [cpForm, setCpForm] = useState({
    client: '', title: '', description: '', status: 'Pending', paymentStatus: 'Unpaid', progress: 0, deadline: '', budget: ''
  });

  // Support Tickets states
  const [supportTickets, setSupportTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Pricing plans states
  const [plans, setPlans] = useState([]);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [planForm, setPlanForm] = useState({ id: '', name: '', priceUSD: '', priceINR: '', desc: '', features: '', color: '#6366f1', popular: false, order: 0 });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [p, cp, m, t, c, b, sv, er, nl, st, pl] = await Promise.all([
        api.get('/projects'),
        api.get('/clients/all'),
        api.get('/contact'),
        api.get('/testimonials/all'),
        api.get('/clients/users'),
        api.get('/blog').catch(() => ({ data: [] })),
        api.get('/services-manage').catch(() => ({ data: [] })),
        api.get('/earnings').catch(() => ({ data: { earnings: [], stats: {} } })),
        api.get('/newsletter').catch(() => ({ data: [] })),
        api.get('/support/admin/all').catch(() => ({ data: [] })),
        api.get('/plans').catch(() => ({ data: [] }))
      ]);
      setProjects(p.data);
      setClientProjects(cp.data);
      setMessages(m.data);
      setTestimonials(t.data);
      setClients(c.data);
      setBlogs(b.data);
      setServices(sv.data);
      setSubscribers(nl.data || []);
      setSupportTickets(st.data || []);
      setPlans(pl?.data || []);
      if (er.data?.earnings) { setEarnings(er.data.earnings); setEarningStats(er.data.stats || {}); }
    } catch (err) {
      toast.error('Failed to load data');
    }
  };

  const handleAdminSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    try {
      const res = await api.post(`/support/admin/${selectedTicket._id}/message`, {
        text: replyText
      });
      setReplyText('');
      setSelectedTicket(res.data);
      setSupportTickets(prev => prev.map(t => t._id === res.data._id ? res.data : t));
    } catch (err) {
      toast.error('Failed to send reply');
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const res = await api.put(`/support/admin/${ticketId}/status`, {
        status: newStatus
      });
      toast.success(`Status updated to ${newStatus}`);
      if (selectedTicket?._id === ticketId) {
        setSelectedTicket(res.data);
      }
      setSupportTickets(prev => prev.map(t => t._id === res.data._id ? res.data : t));
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleProjectSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData(e.target);
      if (editProject) {
        await api.put(`/projects/${editProject._id}`, fd);
        toast.success('Project updated');
      } else {
        await api.post('/projects', fd);
        toast.success('Project created');
      }
      setShowProjectForm(false);
      setEditProject(null);
      setProjectForm({ title: '', description: '', techStack: '', category: 'Web App', liveUrl: '', githubUrl: '', featured: false });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    toast.success('Deleted');
    fetchAll();
  };

  const handleCpSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/clients', cpForm);
      toast.success('Client project created');
      setShowClientProjectForm(false);
      setCpForm({
        client: '', title: '', description: '', status: 'Pending', paymentStatus: 'Unpaid', progress: 0, deadline: '', budget: ''
      });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const updateCpStatus = async (id, data) => {
    await api.put(`/clients/${id}`, data);
    toast.success('Updated');
    fetchAll();
  };

  const sendUpdate = async () => {
    if (!updateMsg.trim()) return;
    await api.post(`/clients/${updateModal}/update`, { message: updateMsg });
    toast.success('Update sent');
    setUpdateModal(null);
    setUpdateMsg('');
    fetchAll();
  };

  const approveTestimonial = async (id) => {
    await api.put(`/testimonials/${id}/approve`);
    toast.success('Approved');
    fetchAll();
  };

  const deleteTestimonial = async (id) => {
    await api.delete(`/testimonials/${id}`);
    toast.success('Deleted');
    fetchAll();
  };

  const markRead = async (id) => {
    await api.put(`/contact/${id}/read`);
    fetchAll();
  };

  const handleBlogSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editBlog) {
        await api.put(`/blog/${editBlog._id}`, blogForm);
        toast.success('Blog updated');
      } else {
        await api.post('/blog', blogForm);
        toast.success('Blog created');
      }
      setShowBlogForm(false);
      setEditBlog(null);
      setBlogForm({ title: '', slug: '', excerpt: '', content: '', category: 'Web Development', published: false });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async id => {
    if (!window.confirm('Delete this blog post?')) return;
    await api.delete(`/blog/${id}`);
    toast.success('Deleted');
    fetchAll();
  };

  const deleteSubscriber = async id => {
    if (!window.confirm('Remove this subscriber from the newsletter?')) return;
    try {
      await api.delete(`/newsletter/${id}`);
      toast.success('Subscriber removed');
      fetchAll();
    } catch (err) {
      toast.error('Failed to remove subscriber');
    }
  };

  const handleBroadcastSubmit = async e => {
    e.preventDefault();
    if (!broadcastForm.subject || !broadcastForm.message) {
      return toast.error('Subject and message are required');
    }
    setLoading(true);
    try {
      const res = await api.post('/newsletter/send', broadcastForm);
      toast.success(res.data.message || 'Newsletter broadcasted successfully!');
      setShowBroadcastForm(false);
      setBroadcastForm({ subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const featuresArray = planForm.features ? planForm.features.split(',').map(f => f.trim()).filter(Boolean) : [];
      const data = { ...planForm, features: featuresArray };
      if (editPlan) {
        await api.put(`/plans/${editPlan._id}`, data);
        toast.success('Plan updated');
      } else {
        await api.post('/plans', data);
        toast.success('Plan created');
      }
      setShowPlanForm(false);
      setEditPlan(null);
      setPlanForm({ id: '', name: '', priceUSD: '', priceINR: '', desc: '', features: '', color: '#6366f1', popular: false, order: 0 });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving plan');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Projects', value: projects.length, icon: <FiFolder />, color: '#6366f1' },
    { label: 'Clients', value: clients.length, icon: <FiUsers />, color: '#8b5cf6' },
    { label: 'Messages', value: messages.filter(m => !m.read).length, icon: <FiMail />, color: '#06b6d4' },
    { label: 'Client Projects', value: clientProjects.length, icon: <FiMessageSquare />, color: '#10b981' }
  ];

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container section">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
            Admin <span className="gradient-text">DevSphere Global</span>
          </h1>
          <p style={{ color: 'var(--text2)' }}>Manage your portfolio, clients, and messages.</p>
        </motion.div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          {stats.map((s, i) => (
            <motion.div key={i} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, fontSize: '1.3rem' }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{s.value}</div>
                <div style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ padding: '10px 20px', borderRadius: '10px', border: '1.5px solid', borderColor: activeTab === tab ? 'var(--accent)' : 'var(--border)', background: activeTab === tab ? 'rgba(99,102,241,0.1)' : 'transparent', color: activeTab === tab ? 'var(--accent)' : 'var(--text2)', fontWeight: 500, cursor: 'pointer', transition: 'var(--transition)' }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Projects Tab */}
        {activeTab === 'Projects' && (          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button className="btn btn-primary" onClick={() => { setShowProjectForm(true); setEditProject(null); }}>
                <FiPlus /> Add Project
              </button>
            </div>

            {showProjectForm && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>{editProject ? 'Edit Project' : 'Add New Project'}</h3>
                <form onSubmit={handleProjectSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Title *</label>
                    <input name="title" defaultValue={editProject?.title || ''} required />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Description *</label>
                    <textarea name="description" defaultValue={editProject?.description || ''} rows={3} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Tech Stack (comma separated)</label>
                    <input name="techStack" defaultValue={editProject?.techStack?.join(', ') || ''} placeholder="React, Node.js, MongoDB" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Category</label>
                    <select name="category" defaultValue={editProject?.category || 'Web App'}>
                      {['Web App', 'E-commerce', 'Full Stack', 'UI/UX', 'Mobile', 'Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Live URL</label>
                    <input name="liveUrl" type="url" defaultValue={editProject?.liveUrl || ''} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>GitHub URL</label>
                    <input name="githubUrl" type="url" defaultValue={editProject?.githubUrl || ''} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Images</label>
                    <input name="images" type="file" multiple accept="image/*" style={{ padding: '8px' }} />
                  </div>
                  <div style={{ gridColumn: '1/-1', display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Project'}</button>
                    <button type="button" className="btn btn-outline" onClick={() => { setShowProjectForm(false); setEditProject(null); }}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {projects.map(p => (
                <div key={p._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <div style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{p.category} • {p.techStack?.join(', ')}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="icon-btn" onClick={() => { setEditProject(p); setShowProjectForm(true); }}><FiEdit2 /></button>
                    <button className="icon-btn" onClick={() => deleteProject(p._id)} style={{ borderColor: 'var(--red)', color: 'var(--red)' }}><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'Services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button className="btn btn-primary" onClick={() => { setShowServiceForm(true); setEditService(null); setServiceForm({ title: '', description: '', icon: 'FiCode', color: '#6366f1', features: '', order: 0, active: true, startingPrice: '', priceLabel: 'Starting from' }); }}>
                <FiPlus /> Add Service
              </button>
            </div>

            {showServiceForm && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>{editService ? 'Edit Service' : 'Add New Service'}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Title *</label>
                    <input value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} placeholder="e.g. Mobile App Development" required />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Description *</label>
                    <textarea value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} rows={3} placeholder="Describe this service..." required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Features (comma separated)</label>
                    <input value={serviceForm.features} onChange={e => setServiceForm({ ...serviceForm, features: e.target.value })} placeholder="Feature 1, Feature 2, Feature 3" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Color</label>
                    <input type="color" value={serviceForm.color} onChange={e => setServiceForm({ ...serviceForm, color: e.target.value })} style={{ height: '44px', padding: '4px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Icon</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${serviceForm.color}20`, border: `1px solid ${serviceForm.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: serviceForm.color, flexShrink: 0 }}>
                        {getIcon(serviceForm.icon)}
                      </div>
                      <select value={serviceForm.icon} onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })} style={{ flex: 1 }}>
                        {Object.entries(iconGroups).map(([group, icons]) => (
                          <optgroup key={group} label={`── ${group} ──`}>
                            {icons.map(ic => (
                              <option key={ic} value={ic}>{ic.replace('Fi', '')}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Order (display position)</label>
                    <input type="number" value={serviceForm.order} onChange={e => setServiceForm({ ...serviceForm, order: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Starting Price ($)</label>
                    <input type="number" value={serviceForm.startingPrice} onChange={e => setServiceForm({ ...serviceForm, startingPrice: e.target.value })} placeholder="e.g. 299" min="0" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Price Label</label>
                    <input value={serviceForm.priceLabel} onChange={e => setServiceForm({ ...serviceForm, priceLabel: e.target.value })} placeholder="e.g. Starting from" />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '24px' }}>
                    <input type="checkbox" id="svc-active" checked={serviceForm.active} onChange={e => setServiceForm({ ...serviceForm, active: e.target.checked })} style={{ width: 'auto' }} />
                    <label htmlFor="svc-active" style={{ fontSize: '0.9rem' }}>Active (visible on website)</label>
                  </div>
                  <div style={{ gridColumn: '1/-1', display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" disabled={loading} onClick={async () => {
                      if (!serviceForm.title || !serviceForm.description) return toast.error('Title and description required');
                      setLoading(true);
                      try {
                        const data = { ...serviceForm, features: serviceForm.features ? serviceForm.features.split(',').map(f => f.trim()).filter(Boolean) : [] };
                        if (editService) { await api.put(`/services-manage/${editService._id}`, data); toast.success('Service updated'); }
                        else { await api.post('/services-manage', data); toast.success('Service created'); }
                        setShowServiceForm(false); setEditService(null); fetchAll();
                      } catch { toast.error('Error saving service'); }
                      finally { setLoading(false); }
                    }}>{loading ? 'Saving...' : 'Save Service'}</button>
                    <button className="btn btn-outline" onClick={() => { setShowServiceForm(false); setEditService(null); }}>Cancel</button>
                  </div>
                </div>
              </motion.div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {services.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '40px' }}>No services yet. Add your first service!</div>}
              {services.map(s => (
                <div key={s._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}20`, border: `1px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, fontWeight: 700, fontSize: '0.8rem' }}>
                      {s.order || 0}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{s.title}</div>
                      <div style={{ color: 'var(--text2)', fontSize: '0.82rem' }}>{s.description.slice(0, 60)}...</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '50px', background: s.active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: s.active ? 'var(--green)' : 'var(--red)' }}>
                      {s.active ? 'Active' : 'Hidden'}
                    </span>
                    <button className="icon-btn" onClick={() => { setEditService(s); setServiceForm({ title: s.title, description: s.description, icon: s.icon, color: s.color, features: s.features?.join(', ') || '', order: s.order, active: s.active, startingPrice: s.startingPrice || '', priceLabel: s.priceLabel || 'Starting from' }); setShowServiceForm(true); }}><FiEdit2 /></button>
                    <button className="icon-btn" onClick={async () => { if (!window.confirm('Delete this service?')) return; await api.delete(`/services-manage/${s._id}`); toast.success('Deleted'); fetchAll(); }} style={{ borderColor: 'var(--red)', color: 'var(--red)' }}><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'Earnings' && (
          <div>
            {/* Overall Stats Cards */}
            <div className="grid-4" style={{ marginBottom: '20px' }}>
              {[
                { label: 'This Month', value: earningStats.monthly || 0, color: '#10b981', growth: earningStats.growth, prefix: '' },
                { label: 'Last Month', value: earningStats.lastMonth || 0, color: '#6366f1', prefix: '' },
                { label: 'This Year', value: earningStats.yearly || 0, color: '#8b5cf6', prefix: '' },
                { label: 'Pending', value: earningStats.pending || 0, color: '#f59e0b', prefix: '' }
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text2)', marginBottom: '8px', fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color }}>${(s.value || 0).toLocaleString()}</div>
                  {s.growth !== undefined && (
                    <div style={{ fontSize: '0.75rem', marginTop: '4px', color: s.growth >= 0 ? '#10b981' : '#ef4444' }}>
                      {s.growth >= 0 ? '↑' : '↓'} {Math.abs(s.growth)}% vs last month
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* India vs International Split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
              {/* India ₹ */}
              <div className="card" style={{ padding: '24px', borderLeft: '3px solid #f97316' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🇮🇳</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>India Earnings</div>
                    <div style={{ color: 'var(--text2)', fontSize: '0.78rem' }}>Razorpay · INR (₹)</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'This Month', value: earningStats.india?.monthly || 0 },
                    { label: 'Last Month', value: earningStats.india?.lastMonth || 0 },
                    { label: 'This Year', value: earningStats.india?.yearly || 0 },
                    { label: 'Total', value: earningStats.india?.total || 0 }
                  ].map((s, i) => (
                    <div key={i} style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: '4px' }}>{s.label}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f97316' }}>
                        ₹{(s.value || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
                {earningStats.india?.growth !== undefined && (
                  <div style={{ marginTop: '10px', fontSize: '0.78rem', color: earningStats.india?.growth >= 0 ? '#10b981' : '#ef4444' }}>
                    {earningStats.india?.growth >= 0 ? '↑' : '↓'} {Math.abs(earningStats.india?.growth)}% vs last month
                  </div>
                )}
              </div>

              {/* International $ */}
              <div className="card" style={{ padding: '24px', borderLeft: '3px solid #6366f1' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '1.5rem' }}>🌍</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>International Earnings</div>
                    <div style={{ color: 'var(--text2)', fontSize: '0.78rem' }}>PayPal · USD ($)</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { label: 'This Month', value: earningStats.international?.monthly || 0 },
                    { label: 'Last Month', value: earningStats.international?.lastMonth || 0 },
                    { label: 'This Year', value: earningStats.international?.yearly || 0 },
                    { label: 'Total', value: earningStats.international?.total || 0 }
                  ].map((s, i) => (
                    <div key={i} style={{ background: 'var(--bg2)', borderRadius: '10px', padding: '12px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginBottom: '4px' }}>{s.label}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#6366f1' }}>
                        ${(s.value || 0).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                {earningStats.international?.growth !== undefined && (
                  <div style={{ marginTop: '10px', fontSize: '0.78rem', color: earningStats.international?.growth >= 0 ? '#10b981' : '#ef4444' }}>
                    {earningStats.international?.growth >= 0 ? '↑' : '↓'} {Math.abs(earningStats.international?.growth)}% vs last month
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button className="btn btn-primary" onClick={() => setShowEarningForm(true)}>
                <FiPlus /> Add Earning
              </button>
            </div>

            {showEarningForm && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Add New Earning</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Title *</label>
                    <input value={earningForm.title} onChange={e => setEarningForm({ ...earningForm, title: e.target.value })} placeholder="e.g. Website for ABC Company" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Amount *</label>
                    <input type="number" value={earningForm.amount} onChange={e => setEarningForm({ ...earningForm, amount: e.target.value })} placeholder="299" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Currency</label>
                    <select value={earningForm.currency} onChange={e => setEarningForm({ ...earningForm, currency: e.target.value })}>
                      <option value="USD">USD ($) — International</option>
                      <option value="INR">INR (₹) — India</option>
                      <option value="GBP">GBP (£) — UK</option>
                      <option value="EUR">EUR (€) — Europe</option>
                      <option value="AUD">AUD (A$) — Australia</option>
                      <option value="CAD">CAD (C$) — Canada</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Client Name</label>
                    <input value={earningForm.client} onChange={e => setEarningForm({ ...earningForm, client: e.target.value })} placeholder="John Smith" />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Category</label>
                    <select value={earningForm.category} onChange={e => setEarningForm({ ...earningForm, category: e.target.value })}>
                      {['Website Development', 'E-commerce', 'UI/UX Design', 'Deployment', 'Maintenance', 'Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Status</label>
                    <select value={earningForm.status} onChange={e => setEarningForm({ ...earningForm, status: e.target.value })}>
                      <option>Received</option>
                      <option>Pending</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Date</label>
                    <input type="date" value={earningForm.date} onChange={e => setEarningForm({ ...earningForm, date: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Note</label>
                    <input value={earningForm.note} onChange={e => setEarningForm({ ...earningForm, note: e.target.value })} placeholder="Optional note..." />
                  </div>
                  <div style={{ gridColumn: '1/-1', display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" disabled={loading} onClick={async () => {
                      if (!earningForm.title || !earningForm.amount) return toast.error('Title and amount required');
                      setLoading(true);
                      try {
                        await api.post('/earnings', earningForm);
                        toast.success('Earning added!');
                        setShowEarningForm(false);
                        setEarningForm({ title: '', amount: '', client: '', category: 'Website Development', status: 'Received', date: new Date().toISOString().split('T')[0], note: '' });
                        fetchAll();
                      } catch { toast.error('Error'); }
                      finally { setLoading(false); }
                    }}>{loading ? 'Saving...' : 'Save'}</button>
                    <button className="btn btn-outline" onClick={() => setShowEarningForm(false)}>Cancel</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Earnings List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {earnings.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '40px' }}>No earnings yet. Add your first earning!</div>}
              {earnings.map(e => (
                <div key={e._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: e.status === 'Received' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: e.status === 'Received' ? '#10b981' : '#f59e0b', fontWeight: 800, fontSize: '0.85rem' }}>
                      ${e.amount}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{e.title}</div>
                      <div style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>
                        {e.client && `${e.client} · `}{e.category} · {new Date(e.date).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '50px', background: e.status === 'Received' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: e.status === 'Received' ? '#10b981' : '#f59e0b' }}>
                      {e.status}
                    </span>
                    <button className="icon-btn" onClick={async () => { if (!window.confirm('Delete?')) return; await api.delete(`/earnings/${e._id}`); toast.success('Deleted'); fetchAll(); }} style={{ borderColor: 'var(--red)', color: 'var(--red)' }}><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client Projects Tab */}
        {activeTab === 'Client Projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button className="btn btn-primary" onClick={() => setShowClientProjectForm(true)}>
                <FiPlus /> Assign Project
              </button>
            </div>

            {showClientProjectForm && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Assign Client Project</h3>
                <form onSubmit={handleCpSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Client *</label>
                    <select value={cpForm.client} onChange={e => setCpForm({ ...cpForm, client: e.target.value })} required>
                      <option value="">Select client</option>
                      {clients.map(c => <option key={c._id} value={c._id}>{c.name} ({c.email})</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Project Title *</label>
                    <input value={cpForm.title} onChange={e => setCpForm({ ...cpForm, title: e.target.value })} required />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Description</label>
                    <textarea value={cpForm.description} onChange={e => setCpForm({ ...cpForm, description: e.target.value })} rows={2} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Status</label>
                    <select value={cpForm.status} onChange={e => setCpForm({ ...cpForm, status: e.target.value })}>
                      {['Pending', 'In Progress', 'Review', 'Completed'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Payment Status</label>
                    <select value={cpForm.paymentStatus || 'Unpaid'} onChange={e => setCpForm({ ...cpForm, paymentStatus: e.target.value })}>
                      {['Unpaid', 'Paid'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Progress (%)</label>
                    <input type="number" min={0} max={100} value={cpForm.progress} onChange={e => setCpForm({ ...cpForm, progress: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Deadline</label>
                    <input type="date" value={cpForm.deadline} onChange={e => setCpForm({ ...cpForm, deadline: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Budget ($)</label>
                    <input type="number" value={cpForm.budget} onChange={e => setCpForm({ ...cpForm, budget: e.target.value })} />
                  </div>
                  <div style={{ gridColumn: '1/-1', display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Assign Project'}</button>
                    <button type="button" className="btn btn-outline" onClick={() => setShowClientProjectForm(false)}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            {updateModal && (
              <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="card" style={{ width: '100%', maxWidth: '440px', padding: '28px' }}>
                  <h3 style={{ marginBottom: '16px' }}>Send Update to Client</h3>
                  <textarea value={updateMsg} onChange={e => setUpdateMsg(e.target.value)} placeholder="Write update message..." rows={4} style={{ marginBottom: '16px' }} />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" onClick={sendUpdate}>Send Update</button>
                    <button className="btn btn-outline" onClick={() => setUpdateModal(null)}>Cancel</button>
                  </div>
                </motion.div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {clientProjects.map(cp => (
                <div key={cp._id} className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{cp.title}</div>
                      <div style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
                        {cp.client?.name} • {cp.client?.email} {cp.budget ? `• Budget: $${cp.budget.toLocaleString()}` : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <select
                        value={cp.status}
                        onChange={e => updateCpStatus(cp._id, { status: e.target.value })}
                        style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', width: 'auto' }}
                      >
                        {['Pending', 'In Progress', 'Review', 'Completed'].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <select
                        value={cp.paymentStatus || 'Unpaid'}
                        onChange={e => updateCpStatus(cp._id, { paymentStatus: e.target.value })}
                        style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', width: 'auto' }}
                      >
                        {['Unpaid', 'Paid'].map(s => <option key={s}>{s}</option>)}
                      </select>
                      <input
                        type="number" min={0} max={100}
                        value={cp.progress}
                        onChange={e => updateCpStatus(cp._id, { progress: e.target.value })}
                        style={{ width: '80px', padding: '6px 10px', fontSize: '0.85rem' }}
                        placeholder="%"
                      />
                      <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={() => setUpdateModal(cp._id)}>
                        <FiMessageSquare /> Update
                      </button>
                    </div>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${cp.progress}%`, background: 'var(--gradient)', borderRadius: '3px', transition: 'width 0.5s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'Messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '40px' }}>No messages yet</div>
            ) : messages.map(m => (
              <div key={m._id} className="card" style={{ padding: '20px', borderLeft: `3px solid ${m.read ? 'var(--border)' : 'var(--accent)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>{m.name}</span>
                    <span style={{ color: 'var(--text2)', fontSize: '0.85rem', marginLeft: '10px' }}>{m.email}</span>
                    {!m.read && <span className="badge" style={{ marginLeft: '10px', fontSize: '0.7rem' }}>New</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                    {!m.read && <button className="icon-btn" onClick={() => markRead(m._id)} title="Mark as read"><FiCheck /></button>}
                  </div>
                </div>
                {m.subject && <div style={{ fontWeight: 500, marginBottom: '6px', fontSize: '0.9rem' }}>{m.subject}</div>}
                <p style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.6 }}>{m.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'Testimonials' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {testimonials.map(t => (
              <div key={t._id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{t.name}</span>
                    {t.company && <span style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>{t.company}</span>}
                    <span className="badge" style={{ fontSize: '0.7rem', background: t.approved ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: t.approved ? 'var(--green)' : 'var(--yellow)', borderColor: t.approved ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)' }}>
                      {t.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{t.message}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {!t.approved && (
                    <button className="icon-btn" onClick={() => approveTestimonial(t._id)} style={{ borderColor: 'var(--green)', color: 'var(--green)' }}><FiCheck /></button>
                  )}
                  <button className="icon-btn" onClick={() => deleteTestimonial(t._id)} style={{ borderColor: 'var(--red)', color: 'var(--red)' }}><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'Blog' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button className="btn btn-primary" onClick={() => { setShowBlogForm(true); setEditBlog(null); setBlogForm({ title: '', slug: '', excerpt: '', content: '', category: 'Web Development', published: false }); }}>
                <FiPlus /> New Post
              </button>
            </div>

            {showBlogForm && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>{editBlog ? 'Edit Blog Post' : 'New Blog Post'}</h3>
                <form onSubmit={handleBlogSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Title *</label>
                    <input value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Slug *</label>
                    <input value={blogForm.slug} onChange={e => setBlogForm({ ...blogForm, slug: e.target.value })} placeholder="my-blog-post" required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Category</label>
                    <select value={blogForm.category} onChange={e => setBlogForm({ ...blogForm, category: e.target.value })}>
                      {['Web Development', 'React', 'Node.js', 'MongoDB', 'UI/UX', 'Career', 'Other'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '24px' }}>
                    <input type="checkbox" id="published" checked={blogForm.published} onChange={e => setBlogForm({ ...blogForm, published: e.target.checked })} style={{ width: 'auto' }} />
                    <label htmlFor="published" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>Published</label>
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Excerpt *</label>
                    <textarea value={blogForm.excerpt} onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} rows={2} required />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Content * (HTML supported)</label>
                    <textarea value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} rows={8} required />
                  </div>
                  <div style={{ gridColumn: '1/-1', display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Post'}</button>
                    <button type="button" className="btn btn-outline" onClick={() => { setShowBlogForm(false); setEditBlog(null); }}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {blogs.length === 0 && <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '40px' }}>No blog posts yet</div>}
              {blogs.map(b => (
                <div key={b._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{b.title}</div>
                    <div style={{ color: 'var(--text2)', fontSize: '0.85rem', marginTop: '4px' }}>
                      {b.category} • {new Date(b.createdAt).toLocaleDateString()} •{' '}
                      <span style={{ color: b.published ? 'var(--green)' : 'var(--yellow)' }}>{b.published ? 'Published' : 'Draft'}</span>
                      {' '}• {b.views} views
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="icon-btn" onClick={() => { setEditBlog(b); setBlogForm({ title: b.title, slug: b.slug, excerpt: b.excerpt, content: b.content, category: b.category, published: b.published }); setShowBlogForm(true); }}><FiEdit2 /></button>
                    <button className="icon-btn" onClick={() => deleteBlog(b._id)} style={{ borderColor: 'var(--red)', color: 'var(--red)' }}><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === 'Newsletter' && (
          <div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h3>Newsletter Subscribers ({subscribers.length})</h3>
              <button 
                className="btn btn-primary" 
                onClick={() => { setShowBroadcastForm(true); setBroadcastForm({ subject: '', message: '' }); }}
                disabled={subscribers.length === 0}
              >
                <FiMail /> Broadcast Email
              </button>
            </div>

            {showBroadcastForm && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>Broadcast Newsletter Email</h3>
                <form onSubmit={handleBroadcastSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Subject *</label>
                    <input 
                      value={broadcastForm.subject} 
                      onChange={e => setBroadcastForm({ ...broadcastForm, subject: e.target.value })} 
                      placeholder="e.g. Exciting New Projects & Tech Trends!" 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Message Content *</label>
                    <textarea 
                      value={broadcastForm.message} 
                      onChange={e => setBroadcastForm({ ...broadcastForm, message: e.target.value })} 
                      placeholder="Write your email newsletter content here. Line breaks will be preserved..." 
                      rows={10} 
                      required 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Broadcast'}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={() => { setShowBroadcastForm(false); setBroadcastForm({ subject: '', message: '' }); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {subscribers.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '40px' }}>No subscribers yet</div>
              ) : (
                subscribers.map(s => (
                  <div key={s._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FiMail style={{ color: 'var(--accent)' }} /> {s.email}
                      </div>
                      <div style={{ color: 'var(--text2)', fontSize: '0.82rem', marginTop: '4px' }}>
                        Subscribed on: {new Date(s.subscribedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-btn" onClick={() => deleteSubscriber(s._id)} style={{ borderColor: 'var(--red)', color: 'var(--red)' }} title="Remove subscriber">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Support Tickets Tab */}
        {activeTab === 'Support Tickets' && (
          <div>
            <h3 style={{ marginBottom: '20px' }}>Client Support Tickets</h3>

            {supportTickets.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '40px' }}>No support tickets yet</div>
            ) : (
              <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
                {/* Ticket List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '600px', overflowY: 'auto', paddingRight: '4px' }}>
                  {supportTickets.map(t => {
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
                        <div style={{ fontWeight: 600, marginBottom: '4px', fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {t.subject}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginBottom: '8px' }}>
                          {t.client?.name || 'Unknown Client'}
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
                {selectedTicket ? (
                  <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '600px', padding: '24px' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{selectedTicket.subject}</h3>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>
                          Client: <strong>{selectedTicket.client?.name}</strong> ({selectedTicket.client?.email}) {selectedTicket.client?.company ? `• ${selectedTicket.client?.company}` : ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <select
                          value={selectedTicket.status}
                          onChange={e => handleUpdateStatus(selectedTicket._id, e.target.value)}
                          style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', width: 'auto' }}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    {/* Messages body */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '8px', marginBottom: '16px' }}>
                      {selectedTicket.messages.map((m, idx) => {
                        const isClient = m.sender === selectedTicket.client?._id;
                        return (
                          <div
                            key={idx}
                            style={{
                              alignSelf: isClient ? 'flex-start' : 'flex-end',
                              maxWidth: '75%',
                              background: isClient ? 'var(--card2)' : 'var(--accent)',
                              color: isClient ? 'var(--text)' : 'white',
                              padding: '12px 18px',
                              borderRadius: '14px',
                              borderBottomLeftRadius: isClient ? '2px' : '14px',
                              borderBottomRightRadius: isClient ? '14px' : '2px',
                              boxShadow: 'var(--shadow-sm)',
                              border: isClient ? '1px solid var(--border2)' : 'none'
                            }}
                          >
                            <div style={{ fontSize: '0.88rem', wordBreak: 'break-word', lineHeight: 1.5 }}>{m.text}</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'right', marginTop: '6px' }}>
                              {isClient ? (selectedTicket.client?.name || 'Client') : 'You (Admin)'} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleAdminSendReply} style={{ display: 'flex', gap: '10px' }}>
                      <input
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        style={{ flex: 1 }}
                      />
                      <button type="submit" className="btn btn-primary" style={{ padding: '0 20px', borderRadius: 'var(--radius)' }}>
                        <FiSend size={16} /> Reply
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '600px', color: 'var(--text3)' }}>
                    Select a support ticket from the sidebar to view thread and reply.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'Pricing' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button className="btn btn-primary" onClick={() => { setShowPlanForm(true); setEditPlan(null); setPlanForm({ id: '', name: '', priceUSD: '', priceINR: '', desc: '', features: '', color: '#6366f1', popular: false, order: plans.length + 1 }); }}>
                <FiPlus /> Add Plan
              </button>
            </div>

            {showPlanForm && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: '28px', marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '20px' }}>{editPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}</h3>
                <form onSubmit={handlePlanSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Plan Name *</label>
                    <input value={planForm.name} onChange={e => setPlanForm({ ...planForm, name: e.target.value })} placeholder="e.g. Basic Website" required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Plan Key (id) *</label>
                    <input value={planForm.id} onChange={e => setPlanForm({ ...planForm, id: e.target.value })} placeholder="e.g. basic" disabled={!!editPlan} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Price USD ($) *</label>
                    <input type="number" value={planForm.priceUSD} onChange={e => setPlanForm({ ...planForm, priceUSD: e.target.value })} placeholder="299" required />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Price INR (₹) *</label>
                    <input type="number" value={planForm.priceINR} onChange={e => setPlanForm({ ...planForm, priceINR: e.target.value })} placeholder="24900" required />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Description</label>
                    <textarea value={planForm.desc} onChange={e => setPlanForm({ ...planForm, desc: e.target.value })} rows={2} placeholder="Brief description..." />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Features (comma separated)</label>
                    <textarea value={planForm.features} onChange={e => setPlanForm({ ...planForm, features: e.target.value })} placeholder="Feature 1, Feature 2, Feature 3" rows={2} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Color Theme</label>
                    <input type="color" value={planForm.color} onChange={e => setPlanForm({ ...planForm, color: e.target.value })} style={{ height: '44px', padding: '4px' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>Display Order</label>
                    <input type="number" value={planForm.order} onChange={e => setPlanForm({ ...planForm, order: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '24px' }}>
                    <input type="checkbox" id="plan-popular" checked={planForm.popular} onChange={e => setPlanForm({ ...planForm, popular: e.target.checked })} style={{ width: 'auto' }} />
                    <label htmlFor="plan-popular" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>Mark as Popular (Highlighted)</label>
                  </div>
                  <div style={{ gridColumn: '1/-1', display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Plan'}</button>
                    <button type="button" className="btn btn-outline" onClick={() => { setShowPlanForm(false); setEditPlan(null); }}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {plans.map(p => (
                <div key={p._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${p.color}20`, border: `1px solid ${p.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.color, fontWeight: 700 }}>
                      {p.order || 0}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {p.name}
                        {p.popular && <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '50px', background: 'var(--accent)', color: 'white', fontWeight: 600 }}>Popular</span>}
                      </div>
                      <div style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
                        USD: ${p.priceUSD} • INR: ₹{p.priceINR?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="icon-btn" onClick={() => { setEditPlan(p); setPlanForm({ id: p.id, name: p.name, priceUSD: p.priceUSD, priceINR: p.priceINR, desc: p.desc || '', features: p.features?.join(', ') || '', color: p.color, popular: p.popular, order: p.order }); setShowPlanForm(true); }}><FiEdit2 /></button>
                    <button className="icon-btn" onClick={async () => { if (!window.confirm('Delete this plan?')) return; await api.delete(`/plans/${p._id}`); toast.success('Deleted'); fetchAll(); }} style={{ borderColor: 'var(--red)', color: 'var(--red)' }}><FiTrash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
