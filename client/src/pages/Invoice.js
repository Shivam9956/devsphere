import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiPrinter, FiArrowLeft } from 'react-icons/fi';
import api from '../api/axios';
import '../components/ProjectCard.css';

export default function Invoice() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/clients/my-projects')
      .then(res => {
        const found = res.data.find(p => p._id === projectId);
        setProject(found);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [projectId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2>Invoice Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ marginTop: '20px' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const invoiceNumber = `INV-${project._id.substring(0, 8).toUpperCase()}`;
  const dateStr = new Date(project.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div style={{ minHeight: '100vh', background: '#080818', color: '#e8eaf6', padding: '40px 20px', paddingTop: '120px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Actions bar (hidden in printing) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
          <button className="btn btn-outline" onClick={() => navigate('/dashboard')} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            <FiArrowLeft /> Back to Dashboard
          </button>
          <button className="btn btn-primary" onClick={() => window.print()} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
            <FiPrinter /> Print / Save PDF
          </button>
        </div>

        {/* Invoice card */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '20px', padding: '50px', position: 'relative', overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '30px', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)', fontFamily: 'Space Grotesk' }}>
                <span className="gradient-text">DevSphere</span> Global
              </div>
              <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginTop: '6px', lineHeight: 1.5 }}>
                Freelance Development & Design<br />
                India · Available Worldwide
              </p>
            </div>
            <div style={{ textAlign: 'right', position: 'relative' }}>
              {/* PAID Stamp */}
              {project.paymentStatus === 'Paid' && (
                <div className="paid-stamp" style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '160px',
                  border: '4px double #10b981',
                  color: '#10b981',
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  padding: '4px 14px',
                  borderRadius: '8px',
                  transform: 'rotate(-12deg)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  opacity: 0.85,
                  userSelect: 'none',
                  zIndex: 10,
                  whiteSpace: 'nowrap'
                }}>
                  PAID
                </div>
              )}
              <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text)', marginBottom: '6px' }}>INVOICE</h1>
              <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Invoice #: <strong>{invoiceNumber}</strong></p>
              <p style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '4px' }}>Date: {dateStr}</p>
            </div>
          </div>

          {/* Bill To */}
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: '0.8rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: 700 }}>Billed To:</h3>
            <div style={{ color: 'var(--text)', fontSize: '1rem', fontWeight: 600 }}>{project.client?.name || 'Client'}</div>
            {project.client?.company && <div style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '2px' }}>{project.client.company}</div>}
            <div style={{ color: 'var(--text2)', fontSize: '0.9rem', marginTop: '2px' }}>{project.client?.email}</div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)' }}>
                <th style={{ textAlign: 'left', padding: '12px 0', color: 'var(--text2)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Description</th>
                <th style={{ textAlign: 'right', padding: '12px 0', color: 'var(--text2)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '20px 0', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.95rem' }}>{project.title}</div>
                  <p style={{ color: 'var(--text2)', fontSize: '0.85rem', marginTop: '4px', lineHeight: 1.5 }}>{project.description}</p>
                </td>
                <td style={{ padding: '20px 0', textAlign: 'right', verticalAlign: 'top', fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>
                  ${project.budget?.toLocaleString()}.00
                </td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '280px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text2)' }}>Subtotal:</span>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>${project.budget?.toLocaleString()}.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '0.9rem', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text2)' }}>Tax (0%):</span>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>$0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', fontSize: '1.15rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--text)' }}>Total Paid:</span>
                <span className="gradient-text">${project.budget?.toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div style={{ marginTop: '60px', paddingTop: '30px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text2)', fontSize: '0.8rem', lineHeight: 1.5 }}>
            Thank you for working with DevSphere Global!<br />
            If you have any questions about this invoice, contact devsphereglobal@gmail.com.
          </div>
        </div>
      </div>

      {/* Printing Stylesheet */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          div:not(.paid-stamp) {
            background: transparent !important;
            border-color: #e2e8f0 !important;
          }
          .paid-stamp {
            border-color: #10b981 !important;
            color: #10b981 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          span, p, h1, h2, h3, td, th {
            color: #000000 !important;
          }
          .gradient-text {
            background: none !important;
            -webkit-text-fill-color: #000000 !important;
            color: #000000 !important;
          }
          table th {
            color: #4a5568 !important;
            border-bottom-color: #cbd5e0 !important;
          }
          table td {
            border-bottom-color: #e2e8f0 !important;
          }
        }
      `}</style>
    </div>
  );
}
