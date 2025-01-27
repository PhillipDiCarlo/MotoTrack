// src/routes/serviceRecordRoutes.js

const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  getAllServiceRecords,
  createServiceRecord,
  updateServiceRecord,
  deleteServiceRecord,
  getServiceRecord
} = require('../controllers/serviceRecordController');
const { validateBody } = require('../middleware/validate');
const {
  createServiceRecordSchema,
  updateServiceRecordSchema
} = require('../schemas/serviceRecordSchemas');

const router = express.Router();

// All routes below require an authenticated user
router.use(verifyToken);

/**
 * GET /service-records
 * Retrieve all service records for the user's vehicles.
 */
router.get('/', getAllServiceRecords);

/**
 * GET /service-records/:id
 * Retrieve a single service record by its ID (if owned by the user).
 */
router.get('/:id', getServiceRecord);

/**
 * POST /service-records
 * Create a new service record (requires request body validation).
 */
router.post('/', validateBody(createServiceRecordSchema), createServiceRecord);

/**
 * PUT /service-records/:id
 * Update an existing service record (partial updates allowed).
 */
router.put('/:id', validateBody(updateServiceRecordSchema), updateServiceRecord);

/**
 * DELETE /service-records/:id
 * Delete a service record (if it belongs to the user).
 */
router.delete('/:id', deleteServiceRecord);

module.exports = router;
