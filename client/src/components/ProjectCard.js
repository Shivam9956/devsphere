import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub } from 'react-icons/fi';
import './ProjectCard.css';

function getImpactMetric(category) {
  switch (category) {
    case 'E-commerce':
      return '📈 +45% Sales';
    case 'Web App':
    case 'Full Stack':
      return '⚡ 100% Speed';
    case 'Mobile':
      return '📱 5★ Rating';
    case 'UI/UX':
      return '🎨 98% Score';
    default:
      return '🚀 High ROI';
  }
}

export default function ProjectCard({ project }) {
  return (
    <motion.div
      className="card project-card"
      whileHover={{ y: -6 }}
      style={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* Image */}
      <div className="project-img">
        {project.image ? (
          <img src={project.image} alt={project.title} loading="lazy" />
        ) : (
          <div className="project-placeholder">💻</div>
        )}
        <div className="project-overlay">
          <div className="project-overlay-btns">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer"
                className="btn btn-primary" style={{ padding: '9px 18px', fontSize: '0.82rem' }}>
                <FiExternalLink size={14} /> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer"
                className="btn" style={{ padding: '9px 18px', fontSize: '0.82rem', background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                <FiGithub size={14} /> Code
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="project-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div className="project-category">{project.category}</div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '50px', background: 'rgba(99,102,241,0.12)', color: 'var(--accent)', border: '1px solid rgba(99,102,241,0.2)', whiteSpace: 'nowrap' }}>
            {getImpactMetric(project.category)}
          </span>
        </div>
        <div className="project-title">{project.title}</div>
        <p className="project-desc">{project.description}</p>
        {project.techStack?.length > 0 && (
          <div className="project-tags" style={{ marginTop: 'auto' }}>
            {project.techStack.slice(0, 4).map((t, i) => (
              <span key={i} className="project-tag">{t}</span>
            ))}
            {project.techStack.length > 4 && (
              <span className="project-tag">+{project.techStack.length - 4}</span>
            )}
          </div>
        )}

      </div>
    </motion.div>
  );
}
