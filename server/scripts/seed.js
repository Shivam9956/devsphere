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
  // Delete existing seeded admin by email to avoid duplicates and ensure static ID
  await User.deleteOne({ email: 'admin@devsphere.global' });
  await User.create({
    _id: new mongoose.Types.ObjectId('6a20610ccd037bf8690215f1'),
    name: 'Shivam Maurya',
    email: 'admin@devsphere.global',
    password: 'Admin@123',
    role: 'admin',
    createdAt: new Date('2026-06-03T17:14:52.767Z')
  });
  console.log('Admin created: admin@devsphere.global / Admin@123');

  // 2. Seed projects (Keep empty for launch)
  await Project.deleteMany({});
  console.log('Cleared all project data');

  // 3. Seed testimonials
  // Delete existing seeded testimonials by their static IDs
  const testimonialIds = [
    '6a20610ccd037bf8690215f5',
    '6a20610ccd037bf8690215f6',
    '6a20610ccd037bf8690215f7'
  ];
  await Testimonial.deleteMany({ _id: { $in: testimonialIds.map(id => new mongoose.Types.ObjectId(id)) } });

  await Testimonial.insertMany([
    {
      _id: new mongoose.Types.ObjectId('6a20610ccd037bf8690215f5'),
      name: 'John Smith',
      role: 'CEO',
      company: 'TechCorp',
      country: 'USA',
      rating: 5,
      message: 'Shivam delivered an exceptional website that exceeded our expectations. Professional, fast, and highly skilled.',
      approved: true,
      createdAt: new Date('2026-06-03T17:14:52.771Z')
    },
    {
      _id: new mongoose.Types.ObjectId('6a20610ccd037bf8690215f6'),
      name: 'Sarah Johnson',
      role: 'Founder',
      company: 'StartupXYZ',
      country: 'UK',
      rating: 5,
      message: 'Outstanding work! The e-commerce platform he built for us increased our sales by 40%. Highly recommended.',
      approved: true,
      createdAt: new Date('2026-06-03T17:14:52.772Z')
    },
    {
      _id: new mongoose.Types.ObjectId('6a20610ccd037bf8690215f7'),
      name: 'Mike Chen',
      role: 'CTO',
      company: 'DevAgency',
      country: 'Canada',
      rating: 5,
      message: 'Best developer I\'ve worked with. Clean code, great communication, and delivered on time.',
      approved: true,
      createdAt: new Date('2026-06-03T17:14:52.773Z')
    }
  ]);
  console.log('Sample testimonials created');
 
  // 4. Seed plans
  await Plan.deleteMany({});
  await Plan.insertMany([
    {
      id: 'landing',
      name: 'Landing Page',
      priceUSD: 99,
      priceINR: 8000,
      delivery: '3-5 days',
      desc: 'High-converting single-page website for ads and lead generation.',
      features: [
        '1 Premium landing page',
        'High-converting layout design',
        'Best for Coaching, SaaS & Real Estate',
        'WhatsApp & CRM contact integration',
        '15 days free support & bug fixes',
        'Fast delivery (3-5 days)'
      ],
      color: '#06b6d4',
      popular: false,
      order: 1
    },
    {
      id: 'business',
      name: 'Business Website',
      priceUSD: 189,
      priceINR: 15000,
      delivery: '7-10 days',
      desc: 'Complete multi-page professional website for your business.',
      features: [
        'Up to 8 custom responsive pages',
        'Ideal for Gyms, Restaurants, Schools & Hospitals',
        'Real Estate & Travel Agency features',
        'Basic SEO optimization & Google Maps',
        'Inquiry form & Lead capture',
        '1 month developer support'
      ],
      color: '#6366f1',
      popular: true,
      order: 2
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Store',
      priceUSD: 429,
      priceINR: 35000,
      delivery: '2-3 weeks',
      desc: 'Fully-featured online store with payment and product management.',
      features: [
        'Unlimited product listings',
        'Clothing, Electronics, Grocery stores',
        'Secure payment gateways (Stripe, UPI)',
        'Inventory & Order dashboard',
        'Automated invoice generator',
        '3 months priority support'
      ],
      color: '#8b5cf6',
      popular: false,
      order: 3
    },
    {
      id: 'maintenance',
      name: 'Maintenance & SEO',
      priceUSD: 65,
      priceINR: 5000,
      delivery: 'Monthly',
      desc: 'Keep your website fast, updated, secure and high-ranking.',
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
