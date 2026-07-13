const express = require('express');
const router = express.Router();
const Earning = require('../models/Earning');
const { protect, adminOnly } = require('../middleware/auth');

// Helper: filter by date range
const inRange = (date, from, to) => {
  const d = new Date(date);
  return d >= from && (!to || d <= to);
};

// GET all earnings with India vs International split (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const earnings = await Earning.find().sort({ date: -1 });

    const now = new Date();
    const thisMonth  = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth  = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const thisYear   = new Date(now.getFullYear(), 0, 1);

    const received = earnings.filter(e => e.status === 'Received');
    const pending  = earnings.filter(e => e.status === 'Pending');

    // Split India (INR) vs International (non-INR)
    const indiaEarnings = received.filter(e => e.currency === 'INR');
    const intlEarnings  = received.filter(e => e.currency !== 'INR');

    // ── India stats (₹) ──────────────────────────────────────────────────────
    const indiaTotal     = indiaEarnings.reduce((s, e) => s + e.amount, 0);
    const indiaMonthly   = indiaEarnings.filter(e => inRange(e.date, thisMonth)).reduce((s, e) => s + e.amount, 0);
    const indiaLastMonth = indiaEarnings.filter(e => inRange(e.date, lastMonth, lastMonthEnd)).reduce((s, e) => s + e.amount, 0);
    const indiaYearly    = indiaEarnings.filter(e => inRange(e.date, thisYear)).reduce((s, e) => s + e.amount, 0);

    // ── International stats ($) ───────────────────────────────────────────────
    const intlTotal     = intlEarnings.reduce((s, e) => s + e.amount, 0);
    const intlMonthly   = intlEarnings.filter(e => inRange(e.date, thisMonth)).reduce((s, e) => s + e.amount, 0);
    const intlLastMonth = intlEarnings.filter(e => inRange(e.date, lastMonth, lastMonthEnd)).reduce((s, e) => s + e.amount, 0);
    const intlYearly    = intlEarnings.filter(e => inRange(e.date, thisYear)).reduce((s, e) => s + e.amount, 0);

    // ── Combined stats ────────────────────────────────────────────────────────
    const totalMonthly   = received.filter(e => inRange(e.date, thisMonth)).reduce((s, e) => s + e.amount, 0);
    const totalLastMonth = received.filter(e => inRange(e.date, lastMonth, lastMonthEnd)).reduce((s, e) => s + e.amount, 0);
    const pendingTotal   = pending.reduce((s, e) => s + e.amount, 0);

    res.json({
      earnings,
      stats: {
        // Overall
        total:     received.reduce((s, e) => s + e.amount, 0),
        monthly:   totalMonthly,
        lastMonth: totalLastMonth,
        yearly:    received.filter(e => inRange(e.date, thisYear)).reduce((s, e) => s + e.amount, 0),
        pending:   pendingTotal,
        growth:    totalLastMonth > 0
          ? (((totalMonthly - totalLastMonth) / totalLastMonth) * 100).toFixed(1)
          : 0,

        // India (INR ₹)
        india: {
          total:     indiaTotal,
          monthly:   indiaMonthly,
          lastMonth: indiaLastMonth,
          yearly:    indiaYearly,
          growth:    indiaLastMonth > 0
            ? (((indiaMonthly - indiaLastMonth) / indiaLastMonth) * 100).toFixed(1)
            : 0
        },

        // International (USD $)
        international: {
          total:     intlTotal,
          monthly:   intlMonthly,
          lastMonth: intlLastMonth,
          yearly:    intlYearly,
          growth:    intlLastMonth > 0
            ? (((intlMonthly - intlLastMonth) / intlLastMonth) * 100).toFixed(1)
            : 0
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add earning (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const earning = await Earning.create(req.body);
    res.status(201).json(earning);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update earning (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const earning = await Earning.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(earning);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE earning (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Earning.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
