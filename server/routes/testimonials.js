const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage for testimonial avatar images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/testimonials';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `avatar_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Public: get approved testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: submit testimonial (with optional avatar upload)
router.post('/', upload.single('avatar'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.avatar = `/uploads/testimonials/${req.file.filename}`;
    }
    const t = await Testimonial.create(data);
    res.status(201).json({ message: 'Thank you! Your review will be published after approval.', data: t });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: direct create testimonial
router.post('/admin', protect, adminOnly, upload.single('avatar'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.avatar = `/uploads/testimonials/${req.file.filename}`;
    }
    if (typeof data.approved === 'string') {
      data.approved = data.approved === 'true';
    } else if (data.approved === undefined) {
      data.approved = true;
    }
    if (data.rating) {
      data.rating = Number(data.rating);
    }
    const t = await Testimonial.create(data);
    res.status(201).json(t);
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

// Admin: update testimonial (with avatar upload)
router.put('/:id', protect, adminOnly, upload.single('avatar'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.avatar = `/uploads/testimonials/${req.file.filename}`;
    }
    if (typeof data.approved === 'string') {
      data.approved = data.approved === 'true';
    }
    if (data.rating) {
      data.rating = Number(data.rating);
    }
    const t = await Testimonial.findByIdAndUpdate(req.params.id, data, { new: true });
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
