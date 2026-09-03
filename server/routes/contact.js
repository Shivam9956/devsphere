const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await Contact.create({ name, email, subject, message });

    // Send email notification
    try {
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact: ${subject || 'Portfolio Inquiry'} from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit Free Website & SEO Audit request
router.post('/audit', async (req, res) => {
  try {
    const { name, email, phone, website, goal, details } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and Email are required' });
    }

    const messageText = `Website/Project: ${website || 'Not provided'}\nGoal/Focus: ${goal || 'General Audit'}\nAdditional Details: ${details || 'None'}`;
    const subject = `🎯 Free Website Audit Request from ${name}`;

    const contact = await Contact.create({
      name,
      email,
      phone,
      website,
      subject,
      message: messageText,
      type: 'audit'
    });

    // Send email notification to Admin
    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        await transporter.sendMail({
          from: `"DevSphere Global Leads" <${process.env.SMTP_USER}>`,
          to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
          subject: `🔥 HIGH-PRIORITY: Free Website Audit Request - ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 24px; background: #ffffff;">
              <h2 style="color: #6366f1; margin-top: 0;">🚀 New Free Website Audit Request!</h2>
              <p style="color: #4b5563; font-size: 15px;">A prospective international client just requested a free website speed, UI & SEO audit report.</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold; width: 35%;">Client Name:</td>
                  <td style="padding: 10px 0; color: #111827; font-weight: 600;">${name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Email Address:</td>
                  <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #6366f1; text-decoration: none; font-weight: 600;">${email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">WhatsApp / Phone:</td>
                  <td style="padding: 10px 0; color: #111827; font-weight: 600;">${phone || 'N/A'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Website URL:</td>
                  <td style="padding: 10px 0;"><a href="${website?.startsWith('http') ? website : `https://${website}`}" target="_blank" style="color: #06b6d4; font-weight: 600;">${website || 'New Project Concept'}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #f3f4f6;">
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold;">Main Goal / Focus:</td>
                  <td style="padding: 10px 0; color: #10b981; font-weight: bold;">${goal || 'Full Audit'}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; font-weight: bold; vertical-align: top;">Notes:</td>
                  <td style="padding: 10px 0; color: #374151;">${details || 'None provided'}</td>
                </tr>
              </table>

              <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #6366f1;">
                <p style="margin: 0; font-size: 14px; color: #4b5563;"><strong>⚡ Recommended Next Step:</strong> Inspect their website speed on PageSpeed Insights and reply with 3 actionable improvements within 24 hours to win the client!</p>
              </div>
            </div>
          `
        });
      }
    } catch (emailErr) {
      console.error('Audit email notification failed:', emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Audit request received successfully! We will analyze your website and send the report within 24 hours.'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all messages
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: mark as read
router.put('/:id/read', protect, adminOnly, async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete message
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
