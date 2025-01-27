// src/middleware/auth.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }
  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback-secret'
    );
    req.user = decoded; // e.g., { userId: 123, iat: 167..., exp: 167... }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
