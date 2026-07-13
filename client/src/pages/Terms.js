import React from 'react';
import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '800px', padding: '60px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Terms of Service</h1>
          <p style={{ color: 'var(--text2)', marginBottom: '40px' }}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          {[
            {
              title: '1. Acceptance of Terms',
              content: 'By accessing and using DevSphere Global\'s website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.'
            },
            {
              title: '2. Services',
              content: `DevSphere Global provides web development services including:
• Custom website development
• E-commerce development
• Full-stack web application development
• UI/UX design
• API development and integration
• Website maintenance and support

All services are subject to a separate project agreement.`
            },
            {
              title: '3. Payment Terms',
              content: `• Prices are listed in USD and INR on our Pricing page
• Payment is required before project commencement (or as per agreed milestones)
• All payments are processed securely via Razorpay or PayPal
• Invoices are due within 7 days of issuance
• Late payments may result in project suspension`
            },
            {
              title: '4. Project Delivery',
              content: `• Estimated timelines are provided at project start and are subject to change based on scope
• Client feedback and approvals are required at each milestone
• Delays caused by client inaction may extend the delivery timeline
• Final delivery is subject to full payment clearance`
            },
            {
              title: '5. Intellectual Property',
              content: `• Upon full payment, the client receives full ownership of the delivered work
• DevSphere Global retains the right to showcase the project in our portfolio (unless confidentiality is agreed)
• Third-party libraries and frameworks remain under their respective licenses
• Client is responsible for ensuring they have rights to any content/assets provided`
            },
            {
              title: '6. Revisions & Refunds',
              content: `• Unlimited revisions are included during the development phase
• Post-launch revisions beyond the agreed scope will be billed separately
• Refunds are available if work has not commenced
• Partial refunds may be issued based on work completed
• No refunds after project delivery and client approval`
            },
            {
              title: '7. Confidentiality',
              content: 'Both parties agree to keep confidential any proprietary information shared during the project. This includes business strategies, technical specifications, and client data.'
            },
            {
              title: '8. Limitation of Liability',
              content: 'DevSphere Global shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific service.'
            },
            {
              title: '9. Contact',
              content: `For questions about these Terms, contact us:
Email: devsphereglobal@gmail.com
WhatsApp: +91 83539 49006`
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
