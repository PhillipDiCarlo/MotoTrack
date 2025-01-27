require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// Create a pool to connect to Postgres
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'app_pass',
  database: process.env.DB_NAME || 'vmr_db',
});

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from Vehicle Maintenance Recorder!' });
});

// Example route to test RLS
app.get('/vehicles', async (req, res) => {
  try {
    // For now, let's pretend user_id = 1
    // In the future, we'll set this dynamically after auth
    const userId = 1;

    // Use a transaction so we can set the session variable
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        `SELECT set_config('app.current_user_id', $1::text, false)`,
        [userId]
      );

      // Now any queries from this connection will be restricted by RLS
      const result = await client.query('SELECT * FROM vehicles');
      await client.query('COMMIT');

      res.json(result.rows);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
