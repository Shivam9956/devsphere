/**
 * Seed script - creates admin user and sample data for DevSphere Global
 * Run: node scripts/seed.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const Plan = require('../models/Plan');
const Service = require('../models/Service');
const Blog = require('../models/Blog');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // 1. Seed admin user
  // Delete existing seeded admin by email or ID to avoid duplicates and ensure static ID
  await User.deleteOne({ $or: [{ email: 'devsphereglobal@gmail.com' }, { _id: new mongoose.Types.ObjectId('6a20610ccd037bf8690215f1') }] });
  await User.create({
    _id: new mongoose.Types.ObjectId('6a20610ccd037bf8690215f1'),
    name: 'Shivam Maurya',
    email: 'devsphereglobal@gmail.com',
    password: 'Shivam@898037',
    role: 'admin',
    createdAt: new Date('2026-06-03T17:14:52.767Z')
  });
  console.log('Admin created: devsphereglobal@gmail.com / Shivam@898037');

  // 2. Seed projects (Keep empty for launch)
  await Project.deleteMany({});
  console.log('Cleared all project data');

  // 3. Seed testimonials (Keep empty for launch / real client reviews)
  await Testimonial.deleteMany({});
  console.log('Cleared all testimonials');

 
  // 4. Seed plans
  await Plan.deleteMany({});
  await Plan.insertMany([
    {
      id: 'business',
      name: 'Business Website',
      priceUSD: 149,
      priceINR: 6999,
      delivery: '5-7 Days',
      billingType: 'One Time',
      desc: 'Establish a powerful online presence for your business with a modern, professional and high-performing website.',
      features: [
        'Modern & Responsive Design',
        'SEO Optimized',
        'Contact & Inquiry Forms',
        'Fast Loading Speed',
        'Social Media Integration'
      ],
      color: '#3b82f6',
      popular: true,
      order: 1
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Website',
      priceUSD: 299,
      priceINR: 12999,
      delivery: '10-14 Days',
      billingType: 'One Time',
      desc: 'Sell your products online with a secure, fast and feature-rich e-commerce website.',
      features: [
        'Product Catalog & Filters',
        'Secure Payment Gateway',
        'Order & Inventory Management',
        'Mobile Responsive Design',
        'Easy Admin Panel'
      ],
      color: '#10b981',
      popular: false,
      order: 2
    },
    {
      id: 'landing',
      name: 'High-Converting Landing Page',
      priceUSD: 99,
      priceINR: 4999,
      delivery: '2-4 Days',
      billingType: 'One Time',
      desc: 'Turn visitors into customers with laser-focused landing pages designed for maximum conversions.',
      features: [
        'Eye-Catching & Modern Design',
        'Compelling Copywriting',
        'CTA & Lead Capture Forms',
        'A/B Testing Ready',
        'Fast Loading & SEO Friendly'
      ],
      color: '#a855f7',
      popular: false,
      order: 3
    },
    {
      id: 'maintenance',
      name: 'Website Maintenance & SEO',
      priceUSD: 69,
      priceINR: 2999,
      delivery: 'Continuous Support',
      billingType: 'Monthly',
      desc: 'Keep your website secure, updated, and ranking high on search engines with our ongoing support and SEO services.',
      features: [
        'Regular Updates & Backup',
        'Bug Fixing & Security Monitoring',
        'On-Page & Off-Page SEO',
        'Performance Optimization',
        'Monthly Reports'
      ],
      color: '#f59e0b',
      popular: false,
      order: 4
    }
  ]);
  console.log('Sample plans created');

  // 5. Seed services
  await Service.deleteMany({});
  await Service.insertMany([
    {
      title: 'Business Website ⭐',
      description: 'Establish a powerful local & global presence with a custom-built website tailored for Gyms, Restaurants, Schools, Hospitals, Real Estate agencies, Manufacturers, Coaching institutes, and Travel agencies.',
      icon: 'FiStar',
      color: '#6366f1',
      features: [
        'Gym, Restaurant, School & Hospital sites',
        'Real Estate, Manufacturing & Travel agencies',
        '100% Mobile Responsive & Premium UI/UX',
        'Fast Loading Speed & Search Engine Optimized',
        'Interactive inquiry forms & Google Maps integration'
      ],
      order: 1,
      active: true,
      startingPrice: 15000,
      priceLabel: '₹15,000 – ₹50,000'
    },
    {
      title: 'E-commerce Website',
      description: 'Fully loaded, secure online store to start selling your products online. Complete with advanced product filters, secure payments, inventory tracking, and custom invoices.',
      icon: 'FiShoppingCart',
      color: '#8b5cf6',
      features: [
        'Tailored for Clothing, Electronics & Grocery',
        'Perfect for Cosmetics & Furniture stores',
        'Secure Payment Gateways (Stripe, UPI, PayPal)',
        'Powerful Admin Dashboard & Inventory System',
        'Automated Invoice and Order status updates'
      ],
      order: 2,
      active: true,
      startingPrice: null,
      priceLabel: 'Custom Quote'
    },
    {
      title: 'High-Converting Landing Page',
      description: 'Laser-focused landing pages optimized to capture quality leads, boost conversions, and maximize the return on your Google and Facebook ad campaigns.',
      icon: 'FiTarget',
      color: '#06b6d4',
      features: [
        'Optimized for Coaching & Course Creators',
        'High-converting for Real Estate lead forms',
        'Tailored for SaaS & local businesses',
        'WhatsApp, Mailchimp & CRM integration',
        'Ultra-fast loading & dynamic CTA buttons'
      ],
      order: 3,
      active: true,
      startingPrice: 8000,
      priceLabel: 'Starting from'
    },
    {
      title: 'Website Maintenance & SEO',
      description: 'Keep your website secure, updated, and ranking high on search engines with our recurring care packages for a worry-free web presence.',
      icon: 'FiRefreshCw',
      color: '#10b981',
      features: [
        'Regular content updates & UI bug fixes',
        'Automated database backups & security scans',
        'Performance optimization & Core Web Vitals',
        'SEO strategy & Google Search Console tracking',
        'Priority developer support'
      ],
      order: 4,
      active: true,
      startingPrice: 5000,
      priceLabel: '₹5,000 / Month'
    }
  ]);
  console.log('Sample services created');

  // 6. Seed blog posts (Keep empty for launch)
  await Blog.deleteMany({});
  console.log('Cleared all blog posts');

  console.log('Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
