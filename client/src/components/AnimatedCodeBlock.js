import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiCopy, FiZap, FiShield, FiCpu, FiTerminal } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SNIPPETS = [
  {
    id: 'react',
    label: 'NextApp.tsx',
    icon: '⚛️',
    language: 'TypeScript / React',
    badge: '100% Type-Safe',
    badgeColor: '#6366f1',
    code: `// DevSphere Global - High-Converting Web Architecture
import { createStore, useAnalytics } from '@devsphere/core';
import { StripeGateway } from '@devsphere/payments';

export async function EcommerceEngine({ client = "Global Brand" }) {
  const store = await createStore({
    framework: "Next.js 15 App Router",
    performance: "100/100 Core Web Vitals",
    loadTime: "0.42s Global TTFB ⚡",
    security: "SOC-2 / End-to-End Encrypted"
  });

  return store.deploy({
    conversionOptimization: true,
    edgeCDN: "Worldwide 🌍 (USA, UK, IN, AU)",
    status: "READY_FOR_PRODUCTION 🚀"
  });
}`
  },
  {
    id: 'api',
    label: 'api/checkout.ts',
    icon: '⚡',
    language: 'Node.js / Express',
    badge: 'Zero-Friction API',
    badgeColor: '#10b981',
    code: `// Multi-Currency Stripe & Razorpay Payment Webhook
import { verifySignature, captureOrder } from './services/payment';

export async function POST(req: Request) {
  const { clientCurrency, cartTotal, projectId } = await req.json();

  // Instant multi-currency conversion (USD $, INR ₹, GBP £)
  const session = await captureOrder({
    currencies: ['USD', 'INR', 'GBP', 'EUR', 'AUD'],
    instantPayout: true,
    autoInvoiceGenerator: true
  });

  return Response.json({ success: true, status: 'PAID' });
}`
  },
  {
    id: 'metrics',
    label: 'lighthouse.config.json',
    icon: '📈',
    language: 'Performance Audit',
    badge: '100/100 Score',
    badgeColor: '#f59e0b',
    code: `{
  "target": "https://devsphere.global",
  "auditScores": {
    "performance": 100,       // ⚡ LCP: 0.8s | FID: 12ms
    "accessibility": 100,     // ♿ 100% WCAG 2.1 Compliant
    "bestPractices": 100,     // 🔒 HTTPS, CSP & Secure Headers
    "seoOptimization": 100    // 🔍 Schema.org & OpenGraph Ready
  },
  "businessImpact": "+42% Average Conversion Increase"
}`
  }
];

export default function AnimatedCodeBlock() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const currentSnippet = SNIPPETS[activeTab];

  // Typing effect on tab change
  useEffect(() => {
    setDisplayedText('');
    let index = 0;
    const fullText = currentSnippet.code;
    const speed = 12; // Fast, crisp typing speed

    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(prev => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    toast.success('Snippet copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Syntax colorizer helper
  const renderHighlightedCode = (text) => {
    return text.split('\n').map((line, lineIdx) => {
      // Colorize line tokens
      let formatted = line;

      // Simple highlight rules
      if (line.trim().startsWith('//')) {
        return (
          <div key={lineIdx} style={{ display: 'flex', gap: '16px' }}>
            <span style={{ color: '#475569', userSelect: 'none', width: '24px', textAlign: 'right', fontSize: '0.78rem' }}>{lineIdx + 1}</span>
            <span style={{ color: '#64748b', fontStyle: 'italic' }}>{line}</span>
          </div>
        );
      }

      return (
        <div key={lineIdx} style={{ display: 'flex', gap: '16px', lineHeight: 1.65 }}>
          <span style={{ color: '#475569', userSelect: 'none', width: '24px', textAlign: 'right', fontSize: '0.78rem', flexShrink: 0 }}>
            {lineIdx + 1}
          </span>
          <span style={{ color: '#cbd5e1' }}>
            {line
              .split(/(\b(?:import|from|export|async|function|const|await|return|true|false)\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b(?:NextApp|EcommerceEngine|POST|Request|Response|StripeGateway)\b)/g)
              .map((token, tokenIdx) => {
                if (['import', 'from', 'export', 'async', 'function', 'const', 'await', 'return'].includes(token)) {
                  return <span key={tokenIdx} style={{ color: '#c084fc', fontWeight: 600 }}>{token}</span>;
                }
                if (['true', 'false'].includes(token)) {
                  return <span key={tokenIdx} style={{ color: '#f59e0b', fontWeight: 600 }}>{token}</span>;
                }
                if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
                  return <span key={tokenIdx} style={{ color: '#38bdf8' }}>{token}</span>;
                }
                if (['NextApp', 'EcommerceEngine', 'POST', 'Request', 'Response', 'StripeGateway'].includes(token)) {
                  return <span key={tokenIdx} style={{ color: '#34d399', fontWeight: 600 }}>{token}</span>;
                }
                return token;
              })}
          </span>
        </div>
      );
    });
  };

  return (
    <div
      className="animated-code-card"
      style={{
        background: 'rgba(10, 10, 26, 0.94)',
        border: '1px solid rgba(99, 102, 241, 0.35)',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.12)',
        backdropFilter: 'blur(20px)',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        width: '100%'
      }}
    >
      {/* Window Controls & Tabs Bar */}
      <div
        className="code-header-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'rgba(6, 6, 18, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          gap: '8px'
        }}
      >
        {/* macOS Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 6px rgba(239, 68, 68, 0.4)' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'inline-block', boxShadow: '0 0 6px rgba(245, 158, 11, 0.4)' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px rgba(16, 185, 129, 0.4)' }} />
        </div>

        {/* Snippet Tabs */}
        <div className="code-tabs-scroll" style={{ display: 'flex', gap: '4px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {SNIPPETS.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: 'none',
                background: activeTab === idx ? 'rgba(99, 102, 241, 0.22)' : 'transparent',
                color: activeTab === idx ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          title="Copy code"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: copied ? '#10b981' : '#94a3b8',
            borderRadius: '6px',
            padding: '5px 8px',
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
        >
          {copied ? <><FiCheck size={12} /> Copied</> : <><FiCopy size={12} /> Copy</>}
        </button>
      </div>

      {/* Code Area */}
      <div
        className="code-content-area"
        style={{
          padding: '18px',
          fontSize: '0.82rem',
          minHeight: '260px',
          maxHeight: '340px',
          overflowY: 'auto',
          overflowX: 'auto',
          color: '#e2e8f0',
          position: 'relative'
        }}
      >
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit' }}>
          {renderHighlightedCode(displayedText)}
          <span style={{ display: 'inline-block', width: '7px', height: '14px', background: '#6366f1', marginLeft: '4px', animation: 'blink 1s infinite' }} />
        </pre>
        <style>{`
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          @media (max-width: 640px) {
            .code-content-area { padding: 12px !important; font-size: 0.74rem !important; min-height: 220px !important; }
            .code-header-bar { padding: 8px 10px !important; }
          }
        `}</style>
      </div>

      {/* Bottom Live Metrics Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'rgba(6, 6, 18, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.75rem',
          color: '#94a3b8',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontWeight: 600 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Live in Production
          </span>
          <span style={{ color: '#475569' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiZap size={12} style={{ color: '#f59e0b' }} /> 0.42s Speed
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ padding: '2px 8px', borderRadius: '12px', background: `${currentSnippet.badgeColor}20`, color: currentSnippet.badgeColor, border: `1px solid ${currentSnippet.badgeColor}40`, fontWeight: 700 }}>
            {currentSnippet.badge}
          </span>
        </div>
      </div>
    </div>
  );
}
