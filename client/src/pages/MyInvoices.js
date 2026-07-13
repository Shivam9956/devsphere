import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFileText, FiDollarSign } from 'react-icons/fi';
import api from '../api/axios';

const statusColor = {
  draft: '#94a3b8', sent: '#6366f1', paid: '#10b981', overdue: '#ef4444'
};

export default function MyInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/invoices/my').then(r => { setInvoices(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const printInvoice = (inv) => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Invoice ${inv.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #1a1a2e; }
        h1 { color: #6366f1; } table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; border: 1px solid #e2e8f0; text-align: left; }
        th { background: #f8fafc; } .total { font-size: 1.2rem; font-weight: bold; }
        .status { padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
      </style></head><body>
      <h1>DevSphere Global</h1>
      <p>Invoice #: <strong>${inv.invoiceNumber}</strong></p>
      <p>Date: ${new Date(inv.createdAt).toLocaleDateString()}</p>
      ${inv.dueDate ? `<p>Due: ${new Date(inv.dueDate).toLocaleDateString()}</p>` : ''}
      <hr/>
      <p><strong>Bill To:</strong><br/>${inv.clientName}<br/>${inv.clientEmail}${inv.clientCompany ? `<br/>${inv.clientCompany}` : ''}</p>
      <table>
        <tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
        ${inv.items.map(i => `<tr><td>${i.description}</td><td>${i.quantity}</td><td>${inv.currency} ${i.rate}</td><td>${inv.currency} ${i.amount}</td></tr>`).join('')}
      </table>
      <p>Subtotal: ${inv.currency} ${inv.subtotal}</p>
      ${inv.tax ? `<p>Tax (${inv.tax}%): ${inv.currency} ${(inv.subtotal * inv.tax / 100).toFixed(2)}</p>` : ''}
      <p class="total">Total: ${inv.currency} ${inv.total}</p>
      ${inv.notes ? `<p><em>Notes: ${inv.notes}</em></p>` : ''}
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container section">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>
            My <span className="gradient-text">Invoices</span>
          </h1>
          <p style={{ color: 'var(--text2)' }}>View and download your invoices</p>
        </motion.div>

        {loading ? <div className="spinner" /> : invoices.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
            <FiFileText size={48} style={{ color: 'var(--text2)', marginBottom: '16px' }} />
            <h3>No invoices yet</h3>
            <p style={{ color: 'var(--text2)' }}>Your invoices will appear here once generated.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {invoices.map((inv, i) => (
              <motion.div key={inv._id} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', padding: '20px 24px' }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '4px' }}>{inv.invoiceNumber}</div>
                  <div style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
                    {new Date(inv.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    {inv.dueDate && ` · Due: ${new Date(inv.dueDate).toLocaleDateString()}`}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{inv.currency} {inv.total?.toFixed(2)}</div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: statusColor[inv.status], background: `${statusColor[inv.status]}20`, padding: '2px 10px', borderRadius: '50px' }}>
                      {inv.status.toUpperCase()}
                    </span>
                  </div>
                  <button className="btn btn-outline" onClick={() => printInvoice(inv)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    <FiDownload /> Download
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
