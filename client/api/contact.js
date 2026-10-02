const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// Cached MongoDB Connection
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  const uri = process.env.MONGO_URI;
  if (!uri) return;
  try {
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000
    });
    isConnected = db.connections[0].readyState === 1;
  } catch (err) {
    console.error('MongoDB connect error in Serverless API:', err.message);
  }
};

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  website: String,
  subject: String,
  message: { type: String, required: true },
  type: { type: String, default: 'contact' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'OK', message: 'Contact API is running' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, subject, message, phone, website, goal, details, type } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ message: 'Please provide name and email.' });
    }

    const isAudit = type === 'audit' || req.url?.includes('audit') || (!message && website);
    const finalSubject = isAudit
      ? `🔥 [Urgent Lead] Free Website Audit Request: ${name}`
      : `📬 [New Inquiry] ${name} - ${subject || 'Portfolio Inquiry'}`;
    const finalMessage = message || `Website: ${website || 'N/A'}\nGoal: ${goal || 'Speed & SEO'}\nNotes: ${details || 'None'}`;

    // 1. Connect and save to MongoDB (in background/parallel)
    const dbPromise = (async () => {
      try {
        await connectDB();
        if (isConnected) {
          await Contact.create({
            name,
            email,
            phone,
            website,
            subject: finalSubject,
            message: finalMessage,
            type: isAudit ? 'audit' : 'contact'
          });
        }
      } catch (dbErr) {
        console.error('Contact DB save error:', dbErr.message);
      }
    })();

    // 2. Send email via Nodemailer
    const smtpUser = process.env.SMTP_USER || 'devsphereglobal@gmail.com';
    const smtpPass = process.env.SMTP_PASS || 'dxmfpdjeuvdqtoll';
    const adminEmail = process.env.ADMIN_EMAIL || smtpUser;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: { rejectUnauthorized: false }
    });

    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const mailPromise = transporter.sendMail({
      from: `"DevSphere Global" <${smtpUser}>`,
      to: adminEmail,
      replyTo: email,
      headers: { 'X-Priority': '1', 'Importance': 'high' },
      subject: `${finalSubject} (${timeStr})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; padding: 24px; background: #ffffff;">
          <h2 style="color: #6366f1; margin-top: 0;">${isAudit ? '🚀 New Free Website Audit Request!' : '📬 New Contact Form Message!'}</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 30%;">Client Name:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Client Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #6366f1; text-decoration: none; font-weight: 600;">${email}</a></td>
            </tr>
            ${phone ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Phone / WhatsApp:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${phone}</td>
            </tr>` : ''}
            ${website ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Website URL:</td>
              <td style="padding: 8px 0;"><a href="${website.startsWith('http') ? website : `https://${website}`}" target="_blank" style="color: #06b6d4; font-weight: 600;">${website}</a></td>
            </tr>` : ''}
            ${subject ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Subject:</td>
              <td style="padding: 8px 0; color: #0f172a;">${subject}</td>
            </tr>` : ''}
          </table>

          <p style="color: #64748b; font-weight: bold; margin-bottom: 6px;">Message / Request Details:</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #6366f1; white-space: pre-wrap; font-size: 14px; color: #1e293b; line-height: 1.6;">${finalMessage}</div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8;">
            Received at ${new Date().toLocaleString()} · Click 'Reply' in Gmail to reply directly to ${email}
          </div>
        </div>
      `
    });

    // Await both DB and Mail
    await Promise.allSettled([dbPromise, mailPromise]);

    return res.status(201).json({
      success: true,
      message: isAudit
        ? 'Audit request received successfully! We will send the report within 24 hours.'
        : 'Message sent successfully! Our team will get back to you within 24 hours.'
    });

  } catch (err) {
    console.error('Contact serverless API error:', err);
    return res.status(500).json({ message: err.message || 'Server error sending message' });
  }
};
