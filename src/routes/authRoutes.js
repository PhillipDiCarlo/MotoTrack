// src/routes/authRoutes.js
const express = require('express');
const { signup, login } = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimit');
const { validateBody } = require('../middleware/validate');
const { signupSchema, loginSchema } = require('../schemas/authSchemas');

const router = express.Router();

// POST /auth/signup
router.post('/signup', validateBody(signupSchema), signup);

// POST /auth/login
router.post('/login', loginLimiter, validateBody(loginSchema), login);

module.exports = router;
