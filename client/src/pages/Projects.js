import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import SkeletonCard from '../components/SkeletonCard';
import '../components/ProjectCard.css';

const categories = ['All', 'Web App', 'E-commerce', 'Full Stack', 'UI/UX', 'Mobile', 'Other'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [active, setActive] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/projects').then(r => {
      setProjects(r.data);
      setFiltered(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filter = (cat) => {
    setActive(cat);
    setFiltered(cat === 'All' ? projects : projects.filter(p => p.category === cat));
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container section">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title">My Projects</h1>
          <p className="section-subtitle">A showcase of my best work across different domains</p>
        </motion.div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '48px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => filter(cat)}
              style={{
                padding: '10px 22px',
                borderRadius: '50px',
                border: '1.5px solid',
                borderColor: active === cat ? 'var(--accent)' : 'var(--border)',
                background: active === cat ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: active === cat ? 'var(--accent)' : 'var(--text2)',
                fontWeight: 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid-3">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '60px 0' }}>
            No projects found in this category yet.
          </div>
        ) : (
          <motion.div
            className="grid-3"
            layout
          >
            <AnimatePresence>
              {filtered.map((p, i) => (
                <motion.div
                  key={p._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProjectCard project={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
