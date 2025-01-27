// src/routes/vehicleRoutes.js
const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  getAllVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');
const { validateBody } = require('../middleware/validate');
const {
  createVehicleSchema,
  updateVehicleSchema
} = require('../schemas/vehicleSchemas');

const router = express.Router();

// All routes require a valid token
router.use(verifyToken);

// GET /vehicles
router.get('/', getAllVehicles);

// POST /vehicles -> validate with createVehicleSchema
router.post('/', validateBody(createVehicleSchema), createVehicle);

// PUT /vehicles/:id -> validate with updateVehicleSchema
router.put('/:id', validateBody(updateVehicleSchema), updateVehicle);

// DELETE /vehicles/:id
router.delete('/:id', deleteVehicle);

module.exports = router;
