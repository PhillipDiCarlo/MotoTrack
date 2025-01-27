// src/schemas/vehicleSchemas.js
const { z } = require("zod");

/**
 * Base vehicle schema:
 *  - year: an integer, must be between 1900 and the next year
 *  - make: required string (min 1 char, max 50)
 *  - model: required string (min 1 char, max 50)
 *  - color: optional string
 *  - vin: optional string (often max length ~17, but let's say 20)
 */
const baseVehicleSchema = z.object({
  year: z
    .number()
    .int()
    .min(1900, "Year must be >= 1900")
    .max(new Date().getFullYear() + 1, "Year is too large"),
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  color: z.string().min(1).max(50).optional(),
  vin: z.string().min(1).max(20).optional(),
});

/**
 * Create Vehicle Schema:
 *  - All fields are required except color, vin which remain optional in the base schema
 */
exports.createVehicleSchema = baseVehicleSchema;

/**
 * Update Vehicle Schema:
 *  - Partial means each field can be omitted if not being updated
 */
exports.updateVehicleSchema = baseVehicleSchema.partial();
