const { z } = require('zod');

const baseServiceRecordSchema = z.object({
  service_advisor: z.string().optional(),
  mileage_in: z.number().int().optional(),
  mileage_out: z.number().int().optional(),
  service_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  // etc...
});

exports.createServiceRecordSchema = baseServiceRecordSchema;
exports.updateServiceRecordSchema = baseServiceRecordSchema.partial();
