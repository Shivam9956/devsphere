const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { globalLimiter, paymentLimiter } = require('./middleware/rateLimiter');

dotenv.config();

const app = express();

// Trust reverse proxy (for accurate client IPs on Render, Vercel, Cloudflare)
app.set('trust proxy', 1);

// Security HTTP Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false
}));

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://devsphereglobal.xyz',
  'https://www.devsphereglobal.xyz',
  'http://devsphereglobal.xyz',
  'http://www.devsphereglobal.xyz',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean).map(url => url.replace(/\/$/, ''));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    const cleanClientUrl = (process.env.CLIENT_URL || '').replace(/\/$/, '');

    // Allow local network origins dynamically
    const isLocal = /^(https?:\/\/localhost(:\d+)?)|(https?:\/\/127\.0\.0\.1(:\d+)?)|(https?:\/\/192\.168\.\d+\.\d+(:\d+)?)|(https?:\/\/10\.\d+\.\d+\.\d+(:\d+)?)|(https?:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+(:\d+)?)$/.test(cleanOrigin);
    
    // Check if origin matches CLIENT_URL or devsphereglobal.xyz domain
    const isDomainAllowed = cleanOrigin.includes('devsphereglobal.xyz');
    const isClientAllowed = cleanClientUrl && (
      cleanOrigin === cleanClientUrl ||
      cleanOrigin === cleanClientUrl.replace('://', '://www.') ||
      cleanOrigin.replace('://www.', '://') === cleanClientUrl
    );

    if (isLocal || isClientAllowed || isDomainAllowed || allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Payload limits to prevent DoS attacks
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Sanitize inputs to prevent NoSQL Injection ($ and . operators)
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Global API rate limiting
app.use('/api', globalLimiter);

app.use(session({
  secret: process.env.JWT_SECRET || 'session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Load passport strategies
require('./routes/auth');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/support', require('./routes/support'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/payments', paymentLimiter, require('./routes/payments'));
const { createOrderHandler, verifyPaymentHandler, paypalCreateOrderHandler, paypalCaptureOrderHandler } = require('./routes/payments');
app.post('/api/create-order', paymentLimiter, createOrderHandler);
app.post('/api/verify-payment', paymentLimiter, verifyPaymentHandler);
app.post('/api/paypal/create-order', paymentLimiter, paypalCreateOrderHandler);
app.post('/api/paypal/capture-order', paymentLimiter, paypalCaptureOrderHandler);
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/services-manage', require('./routes/services'));
app.use('/api/earnings', require('./routes/earnings'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/plans', require('./routes/plans'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Server running securely' }));

// Connect DB & Start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('DB connection error:', err));
