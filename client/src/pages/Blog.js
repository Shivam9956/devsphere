import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiEye, FiClock, FiTag } from 'react-icons/fi';
import api from '../api/axios';
import NewsletterBanner from '../components/NewsletterBanner';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

function SkeletonBlogCard() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ height: 200, background: 'var(--border)', borderRadius: '8px', marginBottom: '16px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: 12, background: 'var(--border)', borderRadius: 4, width: '30%', marginBottom: '12px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: 20, background: 'var(--border)', borderRadius: 4, marginBottom: '10px', animation: 'pulse 1.5s infinite' }} />
      <div style={{ height: 14, background: 'var(--border)', borderRadius: 4, width: '80%', animation: 'pulse 1.5s infinite' }} />
    </div>
  );
}

function readTime(content) {
  const words = content?.split(' ').length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blog')
      .then(r => setBlogs(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container section">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-tag" style={{ display: 'inline-flex', marginBottom: '12px' }}>Blog</div>
          <h1 className="section-title">Articles & Insights</h1>
          <p className="section-subtitle">Thoughts on web development, React, Node.js and more</p>
        </motion.div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {[1, 2, 3].map(i => <SkeletonBlogCard key={i} />)}
          </div>
        ) : blogs.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '80px 0' }}>
            <p style={{ fontSize: '1.1rem' }}>No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <motion.div
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            animate="visible"
            className="blog-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}
          >
            {blogs.map(blog => (
              <motion.div key={blog._id} variants={fadeUp} className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {blog.image ? (
                  <img src={blog.image} alt={blog.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
                ) : (
                  <div style={{ height: 200, background: 'var(--gradient)', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                    📝
                  </div>
                )}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '20px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiTag size={11} /> {blog.category}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '10px', lineHeight: 1.4 }}>{blog.title}</h3>
                  <p style={{ color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '16px', flex: 1 }}>{blog.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '14px', color: 'var(--text3)', fontSize: '0.8rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiCalendar size={12} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiClock size={12} /> {readTime(blog.content)} min read
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiEye size={12} /> {blog.views}
                      </span>
                    </div>
                    <Link to={`/blog/${blog.slug}`} style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                      Read More →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <NewsletterBanner />

      <style>{`
        @media (max-width: 1024px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .blog-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
