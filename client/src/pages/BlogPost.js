import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiEye, FiShare2, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blog/${slug}`)
      .then(r => setBlog(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
        <div className="container section" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ height: 40, background: 'var(--border)', borderRadius: 8, width: '60%', marginBottom: '24px', animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: 300, background: 'var(--border)', borderRadius: 12, marginBottom: '32px', animation: 'pulse 1.5s infinite' }} />
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 16, background: 'var(--border)', borderRadius: 4, marginBottom: '12px', width: i % 2 === 0 ? '90%' : '100%', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '16px' }}>Article not found</h2>
          <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container section" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text2)', marginBottom: '32px', textDecoration: 'none', fontSize: '0.9rem', transition: 'var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
          >
            <FiArrowLeft size={16} /> Back to Blog
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '20px', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiTag size={12} /> {blog.category}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: '20px' }}>{blog.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: '20px', color: 'var(--text2)', fontSize: '0.88rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiCalendar size={14} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiEye size={14} /> {blog.views} views
              </span>
            </div>
            <button onClick={copyLink} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 14px', color: 'var(--text2)', cursor: 'pointer', fontSize: '0.85rem', transition: 'var(--transition)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <FiShare2 size={14} /> Share
            </button>
          </div>

          {blog.image && (
            <img src={blog.image} alt={blog.title} style={{ width: '100%', borderRadius: '12px', marginBottom: '40px', maxHeight: '400px', objectFit: 'cover' }} />
          )}

          <div
            style={{ color: 'var(--text)', lineHeight: 1.85, fontSize: '1rem' }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {blog.tags?.length > 0 && (
            <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {blog.tags.map(tag => (
                <span key={tag} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px', fontSize: '0.8rem', color: 'var(--text2)' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div style={{ marginTop: '48px', textAlign: 'center' }}>
            <Link to="/blog" className="btn btn-outline">
              <FiArrowLeft size={14} /> Back to All Articles
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
