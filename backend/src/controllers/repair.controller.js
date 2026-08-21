const mongoose = require('mongoose');
const { Address, Category, Repair, RepairStatusHistory, Review, TechnicianProfile } = require('../models');
const { getDiagnosis } = require('../utils/diagnosis');

const PHONE_PATTERN = /^[+\d][\d\s-]{7,19}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d(?:-(?:[01]\d|2[0-3]):[0-5]\d)?$/;

function badRequest(message, details = []) { const error = new Error(message); error.statusCode = 400; error.details = details; return error; }
function parseId(value, field) { if (!mongoose.isValidObjectId(value)) throw badRequest(`Invalid ${field}`, [{ field, message: `${field} must be a valid id` }]); return new mongoose.Types.ObjectId(value); }
function safeUser(user) { return user ? { id: user._id, name: user.name, avatar: user.avatar } : null; }

function validateDate(value) {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) throw badRequest('A valid preferredDate is required', [{ field: 'preferredDate', message: 'Use YYYY-MM-DD' }]);
  const date = new Date(`${value}T00:00:00.000Z`);
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value || date < today) throw badRequest('The preferred date must be today or later', [{ field: 'preferredDate', message: 'Choose a future date' }]);
  return date;
}

function validateAddress(address) {
  if (!address || typeof address !== 'object') throw badRequest('A valid address is required', [{ field: 'address', message: 'Enter the service address' }]);
  const fullAddress = address.fullAddress || address.addressLine;
  const required = [['fullAddress', fullAddress], ['city', address.city], ['state', address.state], ['pincode', address.pincode]];
  const missing = required.find(([, value]) => typeof value !== 'string' || !value.trim());
  if (missing) throw badRequest('A complete address is required', [{ field: `address.${missing[0]}`, message: 'This address field is required' }]);
  if (!/^\d{4,10}$/.test(address.pincode.trim())) throw badRequest('A valid pincode is required', [{ field: 'address.pincode', message: 'Pincode must contain 4 to 10 digits' }]);
  return { label: (address.label || 'Booking address').trim().slice(0, 50), fullAddress: fullAddress.trim().slice(0, 300), landmark: address.landmark?.trim(), city: address.city.trim().slice(0, 80), state: address.state.trim().slice(0, 80), pincode: address.pincode.trim() };
}

async function resolveAddress(customerId, addressId, address) {
  if (addressId) {
    const id = parseId(addressId, 'addressId');
    const owned = await Address.findOne({ _id: id, userId: customerId });
    if (!owned) throw new Error('ADDRESS_NOT_FOUND');
    return owned._id;
  }
  const normalized = validateAddress(address);
  const saved = await Address.create({ userId: customerId, ...normalized });
  return saved._id;
}

function repairResponse(repair) {
  const address = repair.addressId && typeof repair.addressId === 'object' ? { id: repair.addressId._id, label: repair.addressId.label, fullAddress: repair.addressId.fullAddress, city: repair.addressId.city, state: repair.addressId.state, pincode: repair.addressId.pincode } : undefined;
  return { id: repair._id, customerId: repair.customerId && typeof repair.customerId === 'object' ? repair.customerId._id : repair.customerId, technicianId: repair.technicianId && typeof repair.technicianId === 'object' ? repair.technicianId._id : repair.technicianId, categoryId: repair.categoryId, applianceId: repair.applianceId, title: repair.title, problemDescription: repair.problemDescription, diagnosisSuggestion: repair.diagnosisSuggestion, addressId: address?.id || repair.addressId, address, preferredDate: repair.preferredDate, preferredTime: repair.preferredTime, status: repair.status, estimatedCost: repair.estimatedCost, customerNotes: repair.customerNotes, createdAt: repair.createdAt, technician: repair.technicianId && typeof repair.technicianId === 'object' ? safeUser(repair.technicianId) : undefined, customer: repair.customerId && typeof repair.customerId === 'object' ? safeUser(repair.customerId) : undefined };
}

function dashboardStatus(status) { return status === 'SEARCHING' ? 'PENDING' : status === 'TECHNICIAN_ON_WAY' ? 'ON_THE_WAY' : status; }

function bookingResponse(repair) { return { ...repairResponse(repair), status: dashboardStatus(repair.status) }; }

async function createRepair(req, res, next) {
  try {
    const { technicianId, applianceId, categoryId, title, problemDescription, diagnosisSuggestion, addressId, address, preferredDate, preferredTime, customerNotes, phone, status, estimatedCost } = req.body || {};
    if (status !== undefined || estimatedCost !== undefined) throw badRequest('Status and estimatedCost are determined by the server', [{ field: 'status', message: 'Do not submit status or estimatedCost' }]);
    const customerId = parseId(req.auth.userId, 'customerId');
    const technicianObjectId = parseId(technicianId, 'technicianId');
    const categoryObjectId = parseId(categoryId, 'categoryId');
    if (!title || typeof title !== 'string' || title.trim().length < 3) throw badRequest('A service title is required', [{ field: 'title', message: 'Title must be at least 3 characters' }]);
    if (!problemDescription || typeof problemDescription !== 'string' || problemDescription.trim().length < 5) throw badRequest('A problem description is required', [{ field: 'problemDescription', message: 'Describe the appliance problem' }]);
    if (phone !== undefined && (typeof phone !== 'string' || !PHONE_PATTERN.test(phone.trim()))) throw badRequest('A valid phone number is required', [{ field: 'phone', message: 'Enter a valid phone number' }]);
    const date = validateDate(preferredDate);
    if (typeof preferredTime !== 'string' || !TIME_PATTERN.test(preferredTime)) throw badRequest('A valid preferredTime is required', [{ field: 'preferredTime', message: 'Use HH:MM or HH:MM-HH:MM' }]);
    const technician = await TechnicianProfile.findOne({ _id: technicianObjectId, verificationStatus: 'VERIFIED', isAvailable: true }).select('userId serviceCategories').lean();
    if (!technician) return res.status(404).json({ success: false, message: 'Technician not found', errors: [] });
    const category = await Category.findOne({ _id: categoryObjectId, isActive: true }).select('slug name').lean();
    if (!category) return res.status(400).json({ success: false, message: 'Category not found', errors: [] });
    if (!technician.serviceCategories.some((id) => id.toString() === categoryObjectId.toString())) return res.status(400).json({ success: false, message: 'Technician does not provide this service category', errors: [] });
    if (applianceId) parseId(applianceId, 'applianceId');
    let savedAddress;
    try { savedAddress = await resolveAddress(customerId, addressId, address); } catch (error) { if (error.message === 'ADDRESS_NOT_FOUND') return res.status(404).json({ success: false, message: 'Address not found', errors: [] }); throw error; }
    const diagnosis = diagnosisSuggestion && typeof diagnosisSuggestion === 'object' ? { issue: diagnosisSuggestion.issue, urgency: diagnosisSuggestion.urgency } : getDiagnosis(category.slug, problemDescription);
    const repair = await Repair.create({ customerId, technicianId: technician.userId, applianceId: applianceId ? parseId(applianceId, 'applianceId') : undefined, categoryId: categoryObjectId, title: title.trim(), problemDescription: problemDescription.trim(), diagnosisSuggestion: diagnosis ? { issue: diagnosis.issue, urgency: diagnosis.urgency } : undefined, addressId: savedAddress, preferredDate: date, preferredTime: preferredTime.trim(), status: 'SEARCHING', customerNotes: customerNotes?.trim(), estimatedCost: diagnosis?.estimatedCost ? Math.round((diagnosis.estimatedCost.min + diagnosis.estimatedCost.max) / 2) : undefined });
    const populated = await Repair.findById(repair._id).populate({ path: 'technicianId', select: 'name avatar' }).populate({ path: 'addressId', select: 'label fullAddress city state pincode' }).lean();
    return res.status(201).json({ success: true, message: 'Repair booking created successfully', data: { repair: repairResponse(populated) } });
  } catch (error) { return next(error); }
}

function repairQueryForUser(req) { return req.auth.role === 'CUSTOMER' ? { customerId: req.auth.userId } : { technicianId: req.auth.userId }; }

async function listRepairs(req, res, next) {
  try { const repairs = await Repair.find(repairQueryForUser(req)).sort({ createdAt: -1 }).populate({ path: 'technicianId', select: 'name avatar' }).populate({ path: 'addressId', select: 'label fullAddress city state pincode' }).lean(); return res.json({ success: true, message: 'Repairs retrieved', data: { repairs: repairs.map(repairResponse) } }); } catch (error) { return next(error); }
}

async function getRepair(req, res, next) {
  try { const repairId = parseId(req.params.id, 'repairId'); const repair = await Repair.findOne({ _id: repairId, ...repairQueryForUser(req) }).populate({ path: 'technicianId', select: 'name avatar' }).populate({ path: 'addressId', select: 'label fullAddress city state pincode' }).lean(); if (!repair) return res.status(404).json({ success: false, message: 'Repair not found', errors: [] }); const response = repairResponse(repair); if (req.auth.role === 'CUSTOMER') response.review = await Review.findOne({ repairId, customerId: req.auth.userId }).select('rating comment createdAt').lean(); return res.json({ success: true, message: 'Repair retrieved', data: { repair: response } }); } catch (error) { return next(error); }
}

async function listTechnicianBookings(req, res, next) {
  try {
    const repairs = await Repair.find({ technicianId: req.auth.userId }).sort({ createdAt: -1 }).populate({ path: 'customerId', select: 'name avatar' }).populate({ path: 'addressId', select: 'label fullAddress city state pincode' }).lean();
    return res.json({ success: true, message: 'Technician bookings retrieved', data: { bookings: repairs.map(bookingResponse) } });
  } catch (error) { return next(error); }
}

async function updateBookingStatus(req, res, next) {
  try {
    const repairId = parseId(req.params.id, 'bookingId');
    const requestedStatus = req.body?.status;
    const allowedStatuses = ['ACCEPTED', 'REJECTED', 'ON_THE_WAY', 'COMPLETED'];
    if (!allowedStatuses.includes(requestedStatus)) throw badRequest('Invalid booking status', [{ field: 'status', message: `Status must be one of: ${allowedStatuses.join(', ')}` }]);
    const repair = await Repair.findOne({ _id: repairId, technicianId: req.auth.userId }).populate({ path: 'customerId', select: 'name avatar' }).populate({ path: 'addressId', select: 'label fullAddress city state pincode' });
    if (!repair) return res.status(404).json({ success: false, message: 'Booking not found', errors: [] });
    const currentStatus = dashboardStatus(repair.status);
    const transitions = { PENDING: ['ACCEPTED', 'REJECTED'], ACCEPTED: ['ON_THE_WAY'], ON_THE_WAY: ['COMPLETED'] };
    if (!transitions[currentStatus]?.includes(requestedStatus)) return res.status(422).json({ success: false, message: `Cannot move booking from ${currentStatus} to ${requestedStatus}`, errors: [] });
    if (requestedStatus === 'REJECTED') {
      const response = bookingResponse(repair);
      repair.technicianId = undefined;
      await repair.save();
      return res.json({ success: true, message: 'Booking rejected', data: { booking: { ...response, status: 'REJECTED' } } });
    }
    const storedStatus = requestedStatus === 'ON_THE_WAY' ? 'TECHNICIAN_ON_WAY' : requestedStatus;
    repair.status = storedStatus;
    if (requestedStatus === 'ACCEPTED') repair.acceptedAt = new Date();
    if (requestedStatus === 'ON_THE_WAY') repair.startedAt = new Date();
    if (requestedStatus === 'COMPLETED') repair.completedAt = new Date();
    await repair.save();
    await RepairStatusHistory.create({ repairId: repair._id, status: storedStatus, changedBy: req.auth.userId, note: `Technician changed booking to ${requestedStatus}` });
    return res.json({ success: true, message: `Booking marked ${requestedStatus}`, data: { booking: bookingResponse(repair.toObject()) } });
  } catch (error) { return next(error); }
}

module.exports = { createRepair, listRepairs, getRepair, listTechnicianBookings, updateBookingStatus };
