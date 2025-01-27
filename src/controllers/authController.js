// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { dbPool } = require('../index'); // or better yet, ../config/db

// Support for Winston Logging
const logger = require('./config/logger');

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 1. Check if email already exists
    const checkResult = await dbPool.query(
      'SELECT user_id FROM users WHERE email = $1',
      [email]
    );
    if (checkResult.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    // 2. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Insert user
    const result = await dbPool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2) RETURNING user_id, email`,
      [email, passwordHash]
    );
    const newUser = result.rows[0];

    // 4. Return success
    res.status(201).json({
      userId: newUser.user_id,
      email: newUser.email
    });
  } catch (error) {
    logger.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const userResult = await dbPool.query(
      'SELECT user_id, password_hash FROM users WHERE email = $1',
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { user_id, password_hash } = userResult.rows[0];

    // 2. Compare password
    const match = await bcrypt.compare(password, password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Generate JWT
    const token = jwt.sign(
      { userId: user_id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    // 4. Return token
    res.status(200).json({ token });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
