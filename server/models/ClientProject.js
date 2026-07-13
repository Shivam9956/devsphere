const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const clientProjectSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Review', 'Completed'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid'
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  deadline: { type: Date },
  budget: { type: Number },
  updates: [updateSchema],
  documents: [{ name: String, url: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClientProject', clientProjectSchema);
