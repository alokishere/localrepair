const mongoose = require('mongoose');
const { VERIFICATION_STATUSES } = require('../constants');

const pointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: {
      type: [Number],
      validate: {
        validator: (value) => value.length === 2 && value[0] >= -180 && value[0] <= 180 && value[1] >= -90 && value[1] <= 90,
        message: 'Location coordinates must be [longitude, latitude]',
      },
    },
  },
  { _id: false },
);

const technicianProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
    bio: { type: String, trim: true, maxlength: 1000 },
    experienceYears: { type: Number, min: 0, max: 80 },
    serviceCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    skills: [{ type: String, trim: true, maxlength: 80 }],
    location: { type: pointSchema, required: false },
    serviceRadiusKm: { type: Number, min: 1, max: 500, default: 10 },
    serviceArea: { type: String, trim: true, maxlength: 200 },
    verificationStatus: { type: String, enum: VERIFICATION_STATUSES, default: 'PENDING' },
    ratingAverage: { type: Number, min: 0, max: 5, default: 0 },
    totalReviews: { type: Number, min: 0, default: 0 },
    completedJobs: { type: Number, min: 0, default: 0 },
    isAvailable: { type: Boolean, default: false },
  },
  { timestamps: true, collection: 'technicianProfiles' },
);

technicianProfileSchema.index({ location: '2dsphere' });
technicianProfileSchema.index({ serviceCategories: 1 });

module.exports = mongoose.model('TechnicianProfile', technicianProfileSchema);
