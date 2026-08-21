const mongoose = require('mongoose');
const { ESTIMATE_STATUSES } = require('../constants');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 300 },
    quantity: { type: Number, required: true, min: 0.01 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, min: 0 },
  },
  { _id: false },
);

const estimateSchema = new mongoose.Schema(
  {
    repairId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Repair' },
    technicianId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    items: { type: [itemSchema], default: [] },
    laborCost: { type: Number, required: true, min: 0 },
    partsCost: { type: Number, required: true, min: 0 },
    tax: { type: Number, min: 0, default: 0 },
    discount: { type: Number, min: 0, default: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, enum: ESTIMATE_STATUSES, default: 'SENT' },
    customerResponse: { type: String, trim: true, maxlength: 500 },
    respondedAt: { type: Date },
  },
  { timestamps: true, collection: 'estimates' },
);

estimateSchema.index({ repairId: 1 });
estimateSchema.index({ technicianId: 1 });

module.exports = mongoose.model('Estimate', estimateSchema);
