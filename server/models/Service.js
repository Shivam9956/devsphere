const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'FiCode' },
  color: { type: String, default: '#6366f1' },
  features: [{ type: String }],
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  startingPrice: { type: Number, default: null },
  priceLabel: { type: String, default: 'Starting from' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
