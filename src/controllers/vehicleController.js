// src/controllers/vehicleController.js
const { dbPool } = require('../index');

// Support for Winston Logging
const logger = require('./config/logger');

exports.getAllVehicles = async (req, res) => {
  const userId = req.user.userId;
  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');

    // Set our custom param for RLS
    await client.query(
      'SELECT set_config($1, $2, false)',
      ['app.current_user_id', userId.toString()]
    );

    // RLS will filter to only rows where user_id = userId
    const vehiclesResult = await client.query('SELECT * FROM vehicles');
    await client.query('COMMIT');

    res.json(vehiclesResult.rows);
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('getAllVehicles error:', error);
    res.status(500).json({ error: 'Failed to get vehicles' });
  } finally {
    client.release();
  }
};

exports.createVehicle = async (req, res) => {
  const userId = req.user.userId;
  const { year, make, model, color, vin } = req.body;

  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'SELECT set_config($1, $2, false)',
      ['app.current_user_id', userId.toString()]
    );

    const insertResult = await client.query(
      `INSERT INTO vehicles (user_id, year, make, model, color, vin)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING vehicle_id`,
      [userId, year, make, model, color, vin]
    );

    await client.query('COMMIT');
    res.status(201).json({ vehicleId: insertResult.rows[0].vehicle_id });
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('createVehicle error:', error);
    res.status(500).json({ error: 'Failed to create vehicle' });
  } finally {
    client.release();
  }
};

exports.updateVehicle = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;
  const { year, make, model, color, vin } = req.body;

  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'SELECT set_config($1, $2, false)',
      ['app.current_user_id', userId.toString()]
    );

    // Attempt the update
    const updateResult = await client.query(
      `UPDATE vehicles
       SET year = $2,
           make = $3,
           model = $4,
           color = $5,
           vin = $6
       WHERE vehicle_id = $1
       RETURNING vehicle_id`,
      [id, year, make, model, color, vin]
    );

    // If row didn't exist or wasn't owned by current user (RLS),
    // updateResult.rowCount would be 0
    if (updateResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Vehicle not found or not yours' });
    }

    await client.query('COMMIT');
    res.json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('updateVehicle error:', error);
    res.status(500).json({ error: 'Failed to update vehicle' });
  } finally {
    client.release();
  }
};

exports.deleteVehicle = async (req, res) => {
  const userId = req.user.userId;
  const { id } = req.params;

  const client = await dbPool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      'SELECT set_config($1, $2, false)',
      ['app.current_user_id', userId.toString()]
    );

    const deleteResult = await client.query(
      `DELETE FROM vehicles
       WHERE vehicle_id = $1
       RETURNING vehicle_id`,
      [id]
    );

    if (deleteResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Vehicle not found or not yours' });
    }

    await client.query('COMMIT');
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('deleteVehicle error:', error);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  } finally {
    client.release();
  }
};
