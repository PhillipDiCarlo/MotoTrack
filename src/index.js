// src/index.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

// Import route modules
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
// We'll add serviceRecordRoutes, etc., as needed

// Create express app
const app = express();
app.use(express.json());

// Support for Winston Logging
const logger = require('./config/logger');

// Create and export a pool for DB (or do this in a separate config file)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'app_pass',
  database: process.env.DB_NAME || 'vehicle_maintenance',
  // recommended to add SSL config in production
});

// Make pool accessible to other modules via a shared export
module.exports.dbPool = pool;

// Register routes
app.use('/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);

// Health check (for load balancers, uptime monitoring, etc.)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Vehicle Maintenance Recorder API is running on port ${PORT}`);
});
