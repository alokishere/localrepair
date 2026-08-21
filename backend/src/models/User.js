const mongoose = require("mongoose");
const { ROLES } = require("../constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      match: /^[+\d][\d\s-]{7,19}$/,
    },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, required: true, default: "CUSTOMER" },
    avatar: { type: String, trim: true, maxlength: 500 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "users" },
);

const removePasswordHash = (_doc, ret) => {
  delete ret.passwordHash;
  return ret;
};

// Keep password hashes out of serialized responses even when a document was
// created in memory or explicitly queried with passwordHash selected.
userSchema.set("toJSON", { transform: removePasswordHash });
userSchema.set("toObject", { transform: removePasswordHash });

userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);
