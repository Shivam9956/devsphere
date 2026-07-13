const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  client: { type: String },
  category: {
    type: String,
    enum: ['Website Development', 'E-commerce', 'UI/UX Design', 'Deployment', 'Maintenance', 'Other'],
    default: 'Other'
  },
  status: { type: String, enum: ['Pending', 'Received'], default: 'Received' },
  date: { type: Date, default: Date.now },
  note: { type: String }
});

module.exports = mongoose.model('Earning', earningSchema);
