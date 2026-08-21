const mongoose = require("mongoose");
const { User, TechnicianProfile, Category } = require("../models");

const PHONE_PATTERN = /^[+\d][\d\s-]{7,19}$/;
const clean = (value, max) => typeof value === "string" ? value.trim().slice(0, max) : value;
const badRequest = (message, details = []) => Object.assign(new Error(message), { statusCode: 400, details });

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found", errors: [] });
    const technicianProfile = user.role === "TECHNICIAN"
      ? await TechnicianProfile.findOne({ userId: user._id }).populate({ path: "serviceCategories", select: "name slug icon" })
      : null;
    return res.json({ success: true, message: "Profile retrieved", data: { user, technicianProfile, profileComplete: isComplete(user, technicianProfile) } });
  } catch (error) { return next(error); }
}

function isComplete(user, profile) {
  if (!user) return false;
  if (user.role === "CUSTOMER") return Boolean(user.name && user.phone && user.addressLine && user.city && user.pincode);
  return Boolean(user.name && user.phone && profile?.serviceArea && profile?.serviceCategories?.length && profile?.experienceYears !== undefined && profile?.startingPrice !== undefined);
}

async function updateMe(req, res, next) {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found", errors: [] });
    const body = req.body || {};
    if (body.role !== undefined) throw badRequest("Role cannot be changed");
    if (user.role === "TECHNICIAN" && body.serviceCategoryIds !== undefined) {
      if (!Array.isArray(body.serviceCategoryIds) || body.serviceCategoryIds.some((id) => !mongoose.isValidObjectId(id))) throw badRequest("Choose valid service categories");
      const count = await Category.countDocuments({ _id: { $in: body.serviceCategoryIds }, isActive: true });
      if (count !== body.serviceCategoryIds.length) throw badRequest("Choose valid service categories");
    }
    if (body.phone !== undefined && (!PHONE_PATTERN.test(String(body.phone).trim()))) throw badRequest("Enter a valid phone number", [{ field: "phone", message: "Enter a valid phone number" }]);
    ["name", "phone", "avatar", "addressLine", "city", "state", "pincode"].forEach((field) => {
      if (body[field] !== undefined) user[field] = clean(body[field], field === "avatar" ? 500 : field === "addressLine" ? 300 : 100);
    });
    if (user.pincode && !/^\d{4,10}$/.test(user.pincode)) throw badRequest("Enter a valid pincode", [{ field: "pincode", message: "Pincode must contain 4 to 10 digits" }]);
    await user.save();
    let profile = null;
    if (user.role === "TECHNICIAN") {
      profile = await TechnicianProfile.findOneAndUpdate({ userId: user._id }, { $set: { userId: user._id, ...(body.serviceArea !== undefined && { serviceArea: clean(body.serviceArea, 200) }), ...(body.city !== undefined && { city: clean(body.city, 80) }), ...(body.pincode !== undefined && { pincode: clean(body.pincode, 10) }), ...(body.experienceYears !== undefined && { experienceYears: Number(body.experienceYears) }), ...(body.startingPrice !== undefined && { startingPrice: Number(body.startingPrice) }), ...(body.skills !== undefined && { skills: Array.isArray(body.skills) ? body.skills.map((item) => clean(item, 80)).filter(Boolean) : [] }), ...(body.isAvailable !== undefined && { isAvailable: Boolean(body.isAvailable) }), ...(body.serviceCategoryIds !== undefined && { serviceCategories: body.serviceCategoryIds }) } }, { upsert: true, returnDocument: "after", runValidators: true }).populate({ path: "serviceCategories", select: "name slug icon" });
      if (profile && profile.verificationStatus === "PENDING" && profile.serviceArea && profile.serviceCategories?.length > 0) {
        profile.verificationStatus = "VERIFIED";
        profile.isAvailable = true;
        await profile.save();
      }
    }
    return res.json({ success: true, message: "Profile updated", data: { user, technicianProfile: profile, profileComplete: isComplete(user, profile) } });
  } catch (error) {
    if (error?.code === 11000) return next(badRequest("That phone number is already in use"));
    if (error?.name === "ValidationError") {
      error.statusCode = 400;
      error.details = Object.values(error.errors).map((item) => ({ field: item.path, message: item.message }));
    }
    return next(error);
  }
}

module.exports = { getMe, updateMe };
