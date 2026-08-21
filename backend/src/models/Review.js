const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    repairId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Repair",
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    technicianId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: Number.isInteger,
    },
    comment: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true, collection: "reviews" },
);

reviewSchema.index({ repairId: 1, customerId: 1 }, { unique: true });
reviewSchema.index({ technicianId: 1 });
reviewSchema.index({ repairId: 1 });

module.exports = mongoose.model("Review", reviewSchema);
