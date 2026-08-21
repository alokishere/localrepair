const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[a-z0-9-]+$/ },
    icon: { type: String, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 300 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'categories' },
);

categorySchema.index({ isActive: 1 });

module.exports = mongoose.model('Category', categorySchema);
