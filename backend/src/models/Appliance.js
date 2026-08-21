const mongoose = require('mongoose');

const applianceSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Category' },
    brand: { type: String, required: true, trim: true, maxlength: 80 },
    model: { type: String, trim: true, maxlength: 80 },
    nickname: { type: String, required: true, trim: true, maxlength: 80 },
    purchaseYear: { type: Number, min: 1950, max: new Date().getFullYear() },
    image: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true, collection: 'appliances' },
);

applianceSchema.index({ customerId: 1 });

module.exports = mongoose.model('Appliance', applianceSchema);
