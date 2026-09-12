const rateLimit = require('express-rate-limit');

// 1. Global API rate limiter - 300 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again in 15 minutes.'
  }
});

// 2. Auth limiter (Login & Register) - 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});

// 3. Contact & Audit form limiter - 10 submissions per hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many inquiry or audit submissions from this IP. Please try again in an hour.'
  }
});

// 4. Payments limiter - 30 requests per 15 minutes per IP
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Payment request limit exceeded. Please try again after 15 minutes.'
  }
});

module.exports = {
  globalLimiter,
  authLimiter,
  contactLimiter,
  paymentLimiter
};
