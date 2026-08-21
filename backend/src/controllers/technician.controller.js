const mongoose = require('mongoose');
const { Category, TechnicianProfile, Review, User } = require('../models');

function badRequest(message, errors = []) {
  const error = new Error(message);
  error.statusCode = 400;
  error.details = errors;
  return error;
}

function parseObjectId(value, field) {
  if (!mongoose.isValidObjectId(value)) throw badRequest(`Invalid ${field}`, [{ field, message: `${field} must be a valid id` }]);
  return new mongoose.Types.ObjectId(value);
}

function parseBoolean(value, field) {
  if (value === undefined) return undefined;
  if (value !== 'true' && value !== 'false') throw badRequest(`${field} must be true or false`, [{ field, message: `${field} must be true or false` }]);
  return value === 'true';
}

function publicProfile(profile) {
  const user = profile.userId && typeof profile.userId === 'object' ? profile.userId : null;
  return {
    id: profile._id,
    name: user?.name || 'Local technician',
    avatar: user?.avatar,
    bio: profile.bio,
    experienceYears: profile.experienceYears,
    serviceCategories: (profile.serviceCategories || []).map((category) => ({ id: category._id, name: category.name, slug: category.slug, icon: category.icon })),
    skills: profile.skills || [],
    location: profile.location,
    serviceRadiusKm: profile.serviceRadiusKm,
    serviceArea: profile.serviceArea,
    verificationStatus: profile.verificationStatus,
    ratingAverage: profile.ratingAverage,
    totalReviews: profile.totalReviews,
    completedJobs: profile.completedJobs,
    isAvailable: profile.isAvailable,
  };
}

function publicCard(profile, distanceKm) {
  const card = publicProfile(profile);
  delete card.bio;
  delete card.location;
  delete card.serviceRadiusKm;
  if (distanceKm !== undefined) card.distanceKm = Number(distanceKm.toFixed(1));
  return card;
}

const profileQuery = () => TechnicianProfile.find({ verificationStatus: 'VERIFIED', isAvailable: true }).populate({ path: 'userId', select: 'name avatar' }).populate({ path: 'serviceCategories', select: 'name slug icon' });

async function listTechnicians(req, res, next) {
  try {
    const { categoryId, limit = '20' } = req.query;
    const category = categoryId ? parseObjectId(categoryId, 'categoryId') : null;
    const parsedLimit = Number(limit);
    if (!Number.isInteger(parsedLimit) || parsedLimit < 1 || parsedLimit > 50) throw badRequest('limit must be an integer between 1 and 50', [{ field: 'limit', message: 'Use a limit from 1 to 50' }]);
    const query = profileQuery().limit(parsedLimit).sort({ ratingAverage: -1, completedJobs: -1 });
    if (category) query.where('serviceCategories').equals(category);
    const profiles = await query.exec();
    return res.json({ success: true, message: 'Technicians retrieved', data: { technicians: profiles.map((profile) => publicCard(profile)), count: profiles.length } });
  } catch (error) { return next(error); }
}

async function getTechnician(req, res, next) {
  try {
    const profileId = parseObjectId(req.params.id, 'technicianId');
    const profile = await profileQuery().findOne({ _id: profileId }).exec();
    if (!profile) return res.status(404).json({ success: false, message: 'Technician not found', errors: [] });
    const reviews = await Review.find({ technicianId: profile.userId._id || profile.userId }).sort({ createdAt: -1 }).limit(5).populate({ path: 'customerId', select: 'name avatar' }).lean();
    return res.json({
      success: true,
      message: 'Technician profile retrieved',
      data: {
        technician: publicProfile(profile),
        reviews: reviews.map((review) => ({ id: review._id, rating: review.rating, comment: review.comment, createdAt: review.createdAt, customer: review.customerId ? { name: review.customerId.name, avatar: review.customerId.avatar } : null })),
      },
    });
  } catch (error) { return next(error); }
}

async function nearbyTechnicians(req, res, next) {
  try {
    const { lng, lat, categoryId, radius = '10' } = req.query;
    const longitude = Number(lng); const latitude = Number(lat); const radiusKm = Number(radius);
    if (![longitude, latitude, radiusKm].every(Number.isFinite) || longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90 || radiusKm <= 0 || radiusKm > 500) {
      throw badRequest('Valid lng, lat, and radius are required', [{ field: 'location', message: 'lng must be -180..180, lat -90..90, radius 0..500' }]);
    }
    const category = categoryId ? parseObjectId(categoryId, 'categoryId') : null;
    const query = profileQuery().where({ location: { $near: { $geometry: { type: 'Point', coordinates: [longitude, latitude] }, $maxDistance: radiusKm * 1000 } } }).limit(50);
    if (category) query.where('serviceCategories').equals(category);
    const profiles = await query.exec();
    const distance = (profile) => {
      if (!profile.location?.coordinates) return undefined;
      const [profileLng, profileLat] = profile.location.coordinates;
      const earthRadius = 6371;
      const dLat = (profileLat - latitude) * Math.PI / 180;
      const dLng = (profileLng - longitude) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(latitude * Math.PI / 180) * Math.cos(profileLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
      return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };
    return res.json({ success: true, message: 'Nearby technicians retrieved', data: { technicians: profiles.map((profile) => publicCard(profile, distance(profile))), radiusKm, distanceAvailable: true } });
  } catch (error) { return next(error); }
}

async function listCategories(_req, res, next) {
  try {
    const categories = await Category.find({ isActive: true }).select('name slug icon description').sort({ name: 1 }).lean();
    return res.json({ success: true, message: 'Categories retrieved', data: { categories } });
  } catch (error) { return next(error); }
}

module.exports = { listCategories, listTechnicians, getTechnician, nearbyTechnicians };
