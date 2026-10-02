const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');

// Create highly optimized SMTP transporter with connection pooling
const isGmail = !process.env.SMTP_HOST || process.env.SMTP_HOST === 'smtp.gmail.com';

const transporter = nodemailer.createTransport(
  isGmail
    ? {
        service: 'gmail',
        pool: true,
        maxConnections: 3,
        maxMessages: 100,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: { rejectUnauthorized: false }
      }
    : {
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10) || 465,
        secure: parseInt(process.env.SMTP_PORT, 10) === 465 || !process.env.SMTP_PORT,
        pool: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: { rejectUnauthorized: false }
      }
);

// Submit contact form - Ultra-fast instant response
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email, and message.' });
    }

    // 1. Save contact immediately to MongoDB (takes ~15ms)
    const savedContact = await Contact.create({ name, email, subject, message });

    // 2. Return instant HTTP 201 response so user sees "Message Sent!" immediately without lag
    res.status(201).json({ success: true, message: 'Message sent successfully!', data: savedContact });

    // 3. Send email notification asynchronously in the background (fire-and-forget, non-blocking)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      transporter.sendMail({
        from: `"DevSphere Global Contact" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        headers: { 'X-Priority': '1', 'Importance': 'high' },
        subject: `📬 [New Inquiry] ${name} - ${subject || 'Portfolio Inquiry'} (${timeStr})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 24px; background: #ffffff;">
            <h2 style="color: #6366f1; margin-top: 0;">📬 New Contact Form Message!</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Client Email:</strong> <a href="mailto:${email}">${email}</a> (Click reply to respond directly)</p>
            <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #6366f1; white-space: pre-wrap; font-size: 15px; color: #1e293b;">${message}</div>
            <p style="margin-top: 20px; font-size: 13px; color: #64748b;">Received on ${new Date().toLocaleString()} · Saved in DevSphere Admin Dashboard</p>
          </div>
        `
      }).then(info => {
        console.log(`Contact email sent successfully to ${process.env.ADMIN_EMAIL || process.env.SMTP_USER}:`, info.messageId);
      }).catch(emailErr => {
        console.error('Background contact email notification error:', emailErr.message);
      });
    }
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ message: err.message || 'Server error while sending message' });
  }
});

// Submit Free Website & SEO Audit request - Ultra-fast instant response
router.post('/audit', contactLimiter, async (req, res) => {
  try {
    const { name, email, phone, website, goal, details } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and Email are required' });
    }

    const messageText = `Website/Project: ${website || 'Not provided'}\nGoal/Focus: ${goal || 'General Audit'}\nAdditional Details: ${details || 'None'}`;
    const subject = `🎯 Free Website Audit Request from ${name}`;

    // 1. Save lead immediately in database
    const savedAudit = await Contact.create({
      name,
      email,
      phone,
      website,
      subject,
      message: messageText,
      type: 'audit'
    });

    // 2. Return instant response
    res.status(201).json({
      success: true,
      message: 'Audit request received successfully! We will analyze your website and send the report within 24 hours.',
      data: savedAudit
    });

    // 3. Send email notification asynchronously in the background
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      transporter.sendMail({
        from: `"DevSphere Global Leads" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
        replyTo: email,
        headers: { 'X-Priority': '1', 'Importance': 'high' },
        subject: `🔥 [Urgent Lead] Free Website Audit Request: ${name} (${timeStr})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; padding: 24px; background: #ffffff;">
            <h2 style="color: #6366f1; margin-top: 0;">🚀 New Free Website Audit Request!</h2>
            <p style="color: #4b5563; font-size: 15px;">A prospective client just requested a free website speed, UI & SEO audit report.</p>
            
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
            <p style="margin-top: 20px; font-size: 13px; color: #64748b;">Received on ${new Date().toLocaleString()} · Saved in DevSphere Admin Dashboard</p>
          </div>
        `
      }).then(info => {
        console.log(`Audit lead email sent successfully to ${process.env.ADMIN_EMAIL || process.env.SMTP_USER}:`, info.messageId);
      }).catch(emailErr => {
        console.error('Background audit email notification error:', emailErr.message);
      });
    }
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
