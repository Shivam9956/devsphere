const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect, adminOnly } = require('../middleware/auth');

// Public: get approved testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: submit testimonial
router.post('/', async (req, res) => {
  try {
    const t = await Testimonial.create(req.body);
    res.status(201).json({ message: 'Thank you! Your review will be published after approval.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const all = await Testimonial.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: approve
router.put('/:id/approve', protect, adminOnly, async (req, res) => {
  try {
    const t = await Testimonial.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    res.json(t);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
