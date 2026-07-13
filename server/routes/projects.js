const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, adminOnly } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Local storage fallback
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/projects';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET all projects (public)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category && category !== 'All' ? { category } : {};
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create project (admin)
router.post('/', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.techStack === 'string') data.techStack = data.techStack.split(',').map(s => s.trim());
    if (req.files && req.files.length > 0) {
      data.image = `/uploads/projects/${req.files[0].filename}`;
      data.images = req.files.map(f => `/uploads/projects/${f.filename}`);
    }
    const project = await Project.create(data);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update project (admin)
router.put('/:id', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    const data = { ...req.body };
    if (typeof data.techStack === 'string') data.techStack = data.techStack.split(',').map(s => s.trim());
    if (req.files && req.files.length > 0) {
      data.image = `/uploads/projects/${req.files[0].filename}`;
      data.images = req.files.map(f => `/uploads/projects/${f.filename}`);
    }
    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE project (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
