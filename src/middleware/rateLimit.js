// src/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

exports.loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5,              // start blocking after 5 requests
  message: { error: 'Too many login attempts, please try again later.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
});
