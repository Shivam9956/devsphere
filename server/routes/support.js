const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const { protect, adminOnly } = require('../middleware/auth');

// Client: Get own tickets
router.get('/', protect, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ client: req.user._id }).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Client: Create a new ticket
router.post('/', protect, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }
    const ticket = await SupportTicket.create({
      client: req.user._id,
      subject,
      messages: [{ sender: req.user._id, text: message }]
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Client: Reply to a ticket
router.post('/:id/message', protect, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({ _id: req.params.id, client: req.user._id });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    
    ticket.messages.push({ sender: req.user._id, text: req.body.text });
    ticket.status = 'Open';
    ticket.updatedAt = Date.now();
    await ticket.save();
    
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all tickets
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate('client', 'name email company')
      .sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Reply to a ticket
router.post('/admin/:id/message', protect, adminOnly, async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    
    ticket.messages.push({ sender: req.user._id, text: req.body.text });
    ticket.status = 'In Progress';
    ticket.updatedAt = Date.now();
    await ticket.save();
    
    await ticket.populate('client', 'name email company');
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Change ticket status
router.put('/admin/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updatedAt: Date.now() },
      { new: true }
    ).populate('client', 'name email company');
    
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
