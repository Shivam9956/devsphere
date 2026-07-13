const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g. 'basic', 'advanced', 'fullstack'
  name: { type: String, required: true },
  priceUSD: { type: Number, required: true },
  priceINR: { type: Number, required: true },
  desc: { type: String },
  features: [{ type: String }],
  delivery: { type: String },
  color: { type: String, default: '#6366f1' },
  popular: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Plan', planSchema);
