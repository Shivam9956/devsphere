import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px', padding: '60px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Privacy Policy</h1>
          <p style={{ color: 'var(--text2)', marginBottom: '40px' }}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          {[
            {
              title: '1. Information We Collect',
              content: `We collect information you provide directly to us, such as when you:
• Fill out the contact form (name, email, message)
• Register for a client account (name, email, company, phone)
• Make a payment (name, email — payment details are handled by Razorpay/PayPal)
• Subscribe to updates

We also collect usage data such as pages visited, browser type, and IP address through standard server logs.`
            },
            {
              title: '2. How We Use Your Information',
              content: `We use the information we collect to:
• Respond to your inquiries and provide customer support
• Process payments and manage your projects
• Send project updates and important notifications
• Improve our website and services
• Comply with legal obligations

We do not sell, trade, or rent your personal information to third parties.`
            },
            {
              title: '3. Payment Information',
              content: `All payment transactions are processed through secure third-party payment processors (Razorpay and PayPal). We do not store your credit card or banking information on our servers. These processors have their own privacy policies governing the use of your information.`
            },
            {
              title: '4. Cookies',
              content: `We use cookies to enhance your browsing experience, including:
• Session cookies to maintain your login state
• Preference cookies to remember your theme (dark/light mode)

You can disable cookies in your browser settings, though this may affect website functionality.`
            },
            {
              title: '5. Data Security',
              content: `We implement industry-standard security measures including:
• SSL/TLS encryption for all data transmission
• Bcrypt password hashing
• JWT-based authentication
• Secure API endpoints

However, no method of transmission over the internet is 100% secure.`
            },
            {
              title: '6. Your Rights',
              content: `You have the right to:
• Access the personal data we hold about you
• Request correction of inaccurate data
• Request deletion of your account and data
• Opt out of marketing communications

To exercise these rights, contact us at devsphereglobal@gmail.com`
            },
            {
              title: '7. Contact Us',
              content: `If you have questions about this Privacy Policy, please contact us:
Email: devsphereglobal@gmail.com
WhatsApp: +91 83539 49006
Website: DevSphere Global`
            }
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: '36px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: 'var(--accent)' }}>{section.title}</h2>
              <p style={{ color: 'var(--text2)', lineHeight: 1.9, whiteSpace: 'pre-line' }}>{section.content}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
