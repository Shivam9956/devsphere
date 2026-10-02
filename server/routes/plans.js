const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const { protect, adminOnly } = require('../middleware/auth');

const defaultPlans = [
  {
    id: 'landing',
    name: 'Landing Page',
    priceUSD: 99,
    priceINR: 4999,
    delivery: '2-4 Days',
    billingType: 'One Time',
    desc: 'High-converting single-page website for ads, coaches, and lead generation.',
    features: [
      '1 Premium landing page',
      'High-converting layout design',
      'CTA & Lead capture forms',
      'WhatsApp & CRM contact integration',
      '15 days free support & bug fixes',
      'Fast delivery (2-4 days)'
    ],
    color: '#06b6d4',
    popular: false,
    order: 1
  },
  {
    id: 'business',
    name: 'Business Website',
    priceUSD: 149,
    priceINR: 6999,
    delivery: '5-7 Days',
    billingType: 'One Time',
    desc: 'Complete multi-page professional website to establish a strong online presence.',
    features: [
      'Up to 8 custom responsive pages',
      'Ideal for Gyms, Restaurants, Schools & Hospitals',
      'Basic SEO optimization & Google Maps',
      'Inquiry form & Lead capture',
      '1 month developer support',
      'Fast delivery (5-7 days)'
    ],
    color: '#3b82f6',
    popular: true,
    order: 2
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    priceUSD: 299,
    priceINR: 12999,
    delivery: '10-14 Days',
    billingType: 'One Time',
    desc: 'Fully-featured online store with payment gateways and inventory management.',
    features: [
      'Unlimited product catalog & filters',
      'Secure payment gateways (Stripe, UPI, PayPal)',
      'Order & inventory management dashboard',
      'Automated invoice & order tracking',
      '3 months priority developer support',
      'Delivery in 10-14 days'
    ],
    color: '#8b5cf6',
    popular: false,
    order: 3
  },
  {
    id: 'maintenance',
    name: 'Maintenance & SEO',
    priceUSD: 59,
    priceINR: 2999,
    delivery: 'Continuous Support',
    billingType: 'Monthly',
    desc: 'Keep your website fast, updated, secure, and ranking high on search engines.',
    features: [
      'Unlimited content updates & bug fixes',
      'Daily database backups & security scans',
      'Performance optimization & speed tuning',
      'Monthly SEO audit & keyword tracking',
      'Priority developer support'
    ],
    color: '#10b981',
    popular: false,
    order: 4
  }
];

// Get all plans (public)
router.get('/', async (req, res) => {
  try {
    let plans = await Plan.find().sort({ order: 1 });
    const hasOutdated = plans.some(p => 
      (p.id === 'business' && p.priceINR === 15000) || 
      (p.id === 'ecommerce' && p.priceINR === 35000) || 
      (p.id === 'landing' && p.priceINR === 8000) ||
      (p.id === 'maintenance' && p.priceINR === 5000)
    );
    
    if (!plans || plans.length === 0 || hasOutdated) {
      for (const dp of defaultPlans) {
        await Plan.findOneAndUpdate(
          { id: dp.id },
          { $set: dp },
          { upsert: true, new: true }
        );
      }
      plans = await Plan.find().sort({ order: 1 });
    }
    res.json(plans);
  } catch (err) {
    res.json(defaultPlans);
  }
});

// Create a plan (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a plan (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a plan (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
