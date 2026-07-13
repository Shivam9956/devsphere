import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Global error handlers to capture any non-React errors
window.addEventListener('error', (event) => {
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '0';
  errorDiv.style.left = '0';
  errorDiv.style.width = '100vw';
  errorDiv.style.height = '100vh';
  errorDiv.style.backgroundColor = '#080818';
  errorDiv.style.color = '#ef4444';
  errorDiv.style.padding = '40px';
  errorDiv.style.zIndex = '999999';
  errorDiv.style.overflow = 'auto';
  errorDiv.style.fontFamily = 'monospace';
  errorDiv.innerHTML = `
    <h2 style="margin-bottom: 20px;">Runtime JavaScript Error</h2>
    <p style="color: #e8eaf6; font-size: 1.1rem;"><strong>Message:</strong> ${event.message}</p>
    <p style="color: #8892b0;"><strong>File:</strong> ${event.filename} at line ${event.lineno}:${event.colno}</p>
    <pre style="background: #13132a; padding: 20px; border-radius: 8px; margin-top: 20px; color: #8892b0; overflow: auto;">${event.error ? event.error.stack : 'No stack trace available'}</pre>
  `;
  document.body.appendChild(errorDiv);
});

window.addEventListener('unhandledrejection', (event) => {
  const errorDiv = document.createElement('div');
  errorDiv.style.position = 'fixed';
  errorDiv.style.top = '0';
  errorDiv.style.left = '0';
  errorDiv.style.width = '100vw';
  errorDiv.style.height = '100vh';
  errorDiv.style.backgroundColor = '#080818';
  errorDiv.style.color = '#ef4444';
  errorDiv.style.padding = '40px';
  errorDiv.style.zIndex = '999999';
  errorDiv.style.overflow = 'auto';
  errorDiv.style.fontFamily = 'monospace';
  errorDiv.innerHTML = `
    <h2 style="margin-bottom: 20px;">Unhandled Promise Rejection</h2>
    <p style="color: #e8eaf6; font-size: 1.1rem;"><strong>Reason:</strong> ${event.reason}</p>
    <pre style="background: #13132a; padding: 20px; border-radius: 8px; margin-top: 20px; color: #8892b0; overflow: auto;">${event.reason && event.reason.stack ? event.reason.stack : 'No stack trace available'}</pre>
  `;
  document.body.appendChild(errorDiv);
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          background: '#080818',
          color: '#ef4444',
          minHeight: '100vh',
          fontFamily: 'monospace'
        }}>
          <h2 style={{ marginBottom: '20px' }}>Something went wrong in the application.</h2>
          <p style={{ color: '#e8eaf6', fontSize: '1.1rem' }}>{this.state.error?.toString()}</p>
          <pre style={{ background: '#13132a', padding: '20px', borderRadius: '8px', color: '#8892b0', overflow: 'auto', marginTop: '20px' }}>
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
