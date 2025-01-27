// src/middleware/validate.js
const logger = require('../config/logger');

exports.validateBody = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);  // throws an error if invalid
    next();
  } catch (error) {
    logger.warn('Validation failed: %o', error.errors);
    return res.status(400).json({
      error: 'Validation error',
      details: error.errors
    });
  }
};
