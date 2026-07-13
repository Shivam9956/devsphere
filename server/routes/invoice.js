const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { protect, adminOnly } = require('../middleware/auth');

// Generate invoice number
const genInvoiceNo = async () => {
  const count = await Invoice.countDocuments();
  return `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
};

// Admin: create invoice
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { items = [], tax = 0, ...rest } = req.body;
    const subtotal = items.reduce((sum, i) => sum + (i.quantity * i.rate), 0);
    const total = subtotal + (subtotal * tax / 100);
    const invoiceNumber = await genInvoiceNo();

    const invoice = await Invoice.create({
      ...rest, items: items.map(i => ({ ...i, amount: i.quantity * i.rate })),
      subtotal, total, tax, invoiceNumber
    });
    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all invoices
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('client', 'name email').sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update invoice status
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete invoice
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Client: get own invoices
router.get('/my', protect, async (req, res) => {
  try {
    const invoices = await Invoice.find({ client: req.user._id }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
