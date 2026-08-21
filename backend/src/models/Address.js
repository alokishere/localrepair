const mongoose = require("mongoose");

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

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    label: { type: String, required: true, trim: true, maxlength: 50 },
    fullAddress: { type: String, required: true, trim: true, maxlength: 300 },
    landmark: { type: String, trim: true, maxlength: 150 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    state: { type: String, required: true, trim: true, maxlength: 80 },
    pincode: { type: String, required: true, trim: true, match: /^\d{4,10}$/ },
    location: { type: pointSchema, required: false },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true, collection: "addresses" },
);

addressSchema.index({ userId: 1 });
addressSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Address", addressSchema);
