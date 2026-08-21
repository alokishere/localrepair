const mongoose = require("mongoose");
const { REPAIR_STATUSES } = require("../constants");

const pointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: {
      type: [Number],
      validate: {
        validator: (value) =>
          value.length === 2 &&
          value[0] >= -180 &&
          value[0] <= 180 &&
          value[1] >= -90 &&
          value[1] <= 90,
        message: "Location coordinates must be [longitude, latitude]",
      },
    },
  },
  { _id: false },
);

const diagnosisSuggestionSchema = new mongoose.Schema(
  {
    issue: { type: String, trim: true, maxlength: 300 },
    urgency: { type: String, enum: ["LOW", "MEDIUM", "HIGH"] },
  },
  { _id: false },
);

const repairSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    applianceId: { type: mongoose.Schema.Types.ObjectId, ref: "Appliance" },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 160,
    },
    problemDescription: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 2000,
    },
    diagnosisSuggestion: { type: diagnosisSuggestionSchema },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    location: { type: pointSchema, required: false },
    preferredDate: { type: Date },
    preferredTime: { type: String, trim: true, maxlength: 50 },
    status: {
      type: String,
      enum: REPAIR_STATUSES,
      required: true,
      default: "SEARCHING",
    },
    estimatedCost: { type: Number, min: 0 },
    finalCost: { type: Number, min: 0 },
    customerNotes: { type: String, trim: true, maxlength: 1000 },
    technicianNotes: { type: String, trim: true, maxlength: 1000 },
    acceptedAt: { type: Date },
    startedAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancellationReason: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true, collection: "repairs" },
);

repairSchema.pre("validate", function validateRepairLocation() {
  if (!this.addressId && !this.location) {
    this.invalidate("addressId", "A repair requires an addressId or location");
  }
});

repairSchema.index({ customerId: 1 });
repairSchema.index({ technicianId: 1 });
repairSchema.index({ status: 1 });
repairSchema.index({ categoryId: 1 });
repairSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Repair", repairSchema);
