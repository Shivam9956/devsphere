const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/newsletter — subscribe
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Already subscribed' });
    const subscriber = await Newsletter.create({ email });
    res.status(201).json({ message: 'Subscribed successfully', subscriber });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/newsletter — get all subscribers (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/newsletter/:id — remove subscriber (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subscriber removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/newsletter/send — broadcast email to all subscribers (admin only)
router.post('/send', protect, adminOnly, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const subscribers = await Newsletter.find({}, 'email');
    if (subscribers.length === 0) {
      return res.status(400).json({ message: 'No active subscribers found' });
    }

    const emails = subscribers.map(s => s.email);

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    // Send bulk mail using BCC to keep reader emails hidden and secure
    await transporter.sendMail({
      from: `"DevSphere Global Newsletter" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to self
      bcc: emails, // All subscriber emails in BCC
      subject: subject,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #0f0f23; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="text-align: center; margin-bottom: 28px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px;">
            <h1 style="color: #6366f1; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.02em;">DevSphere Global</h1>
            <p style="color: #64748b; margin: 6px 0 0 0; font-size: 14px; font-weight: 500;">Modern High-Performance Web Applications</p>
          </div>
          <div style="font-size: 16px; line-height: 1.7; color: #334155; white-space: pre-wrap;">
${message}
          </div>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
            <p style="margin: 0 0 8px 0;">You are receiving this because you subscribed to updates from Shivam Maurya at DevSphere Global.</p>
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} DevSphere Global. All rights reserved.</p>
          </div>
        </div>
      `
    });

    res.json({ message: `Newsletter broadcasted successfully to ${emails.length} subscriber(s)!` });
  } catch (err) {
    console.error('Newsletter broadcast error:', err);
    res.status(500).json({ message: err.message || 'SMTP Server Error. Please verify SMTP settings.' });
  }
});

module.exports = router;

