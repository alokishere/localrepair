const mongoose = require("mongoose");
const { REPAIR_STATUSES } = require("../constants");

const repairStatusHistorySchema = new mongoose.Schema(
  {
    repairId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Repair",
    },
    status: { type: String, required: true, enum: REPAIR_STATUSES },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    note: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true, collection: "repairStatusHistory" },
);

repairStatusHistorySchema.index({ repairId: 1, createdAt: 1 });

module.exports = mongoose.model(
  "RepairStatusHistory",
  repairStatusHistorySchema,
);
