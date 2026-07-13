import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi';
import api from '../api/axios';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then(r => { setProject(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  if (!project) return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
      <div style={{ fontSize: '3rem' }}>🔍</div>
      <h2>Project not found</h2>
      <Link to="/projects" className="btn btn-primary"><FiArrowLeft size={15} /> Back to Projects</Link>
    </div>
  );

  const images = project.images?.length ? project.images : (project.image ? [project.image] : []);

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container section">

        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ marginBottom: '32px' }}>
          <Link to="/projects" className="btn btn-outline" style={{ display: 'inline-flex' }}>
            <FiArrowLeft size={15} /> Back to Projects
          </Link>
        </motion.div>

        <div className="project-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>

          {/* Left: Images */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            {images.length > 0 ? (
              <>
                <div style={{
                  borderRadius: 'var(--radius-lg)', overflow: 'hidden',
                  border: '1px solid var(--border)', marginBottom: '12px',
                  background: 'var(--card2)', aspectRatio: '16/9'
                }}>
                  <img
                    src={images[activeImg]}
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                {images.length > 1 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(i)}
                        style={{
                          width: '72px', height: '52px', borderRadius: '8px', overflow: 'hidden',
                          border: `2px solid ${i === activeImg ? 'var(--accent)' : 'var(--border)'}`,
                          padding: 0, cursor: 'pointer', background: 'none', transition: 'border-color 0.2s'
                        }}
                      >
                        <img src={img} alt={`thumb-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                background: 'var(--card2)', aspectRatio: '16/9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '4rem'
              }}>
                💻
              </div>
            )}
          </motion.div>

          {/* Right: Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div style={{ marginBottom: '12px' }}>
              <span style={{
                fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)',
                textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>
                {project.category}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              {project.title}
            </h1>

            <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '16px', fontSize: '0.97rem' }}>
              {project.description}
            </p>

            {project.longDescription && (
              <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '28px', fontSize: '0.95rem' }}>
                {project.longDescription}
              </p>
            )}

            {/* Tech Stack */}
            {project.techStack?.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                  Tech Stack
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {project.techStack.map((t, i) => (
                    <span key={i} style={{
                      padding: '5px 14px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600,
                      background: 'rgba(99,102,241,0.1)', color: 'var(--accent)',
                      border: '1px solid rgba(99,102,241,0.2)'
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                  <FiExternalLink size={15} /> Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
                  <FiGithub size={15} /> View Code
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .project-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
