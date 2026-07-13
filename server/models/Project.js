const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  longDescription: { type: String },
  techStack: [{ type: String }],
  category: {
    type: String,
    enum: ['Web App', 'E-commerce', 'Full Stack', 'UI/UX', 'Mobile', 'Other'],
    default: 'Web App'
  },
  image: { type: String },
  images: [{ type: String }],
  liveUrl: { type: String },
  githubUrl: { type: String },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
