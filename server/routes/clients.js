const express = require('express');
const router = express.Router();
const ClientProject = require('../models/ClientProject');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// Client: get own projects
router.get('/my-projects', protect, async (req, res) => {
  try {
    const projects = await ClientProject.find({ client: req.user._id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all client projects
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const projects = await ClientProject.find().populate('client', 'name email company').sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all clients
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' }).select('-password');
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: create client project
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const project = await ClientProject.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update project status/progress
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await ClientProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: add update message to project
router.post('/:id/update', protect, adminOnly, async (req, res) => {
  try {
    const project = await ClientProject.findById(req.params.id);
    project.updates.push({ message: req.body.message });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete client project
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await ClientProject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
