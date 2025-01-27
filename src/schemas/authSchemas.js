// src/schemas/authSchemas.js
const { z } = require('zod');

exports.signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128)
});

exports.loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(128)
});
