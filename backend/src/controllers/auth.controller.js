const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User, TechnicianProfile } = require('../models');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s-]{7,19}$/;
const ALLOWED_REGISTRATION_ROLES = ['CUSTOMER', 'TECHNICIAN'];

function validationError(message, details = []) { const error = new Error(message); error.statusCode = 400; error.details = details; return error; }

function validateCredentials({ name, email, phone, password, role }, isRegistration = false) {
  const errors = [];
  if (isRegistration && (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100)) errors.push({ field: 'name', message: 'Name must be between 2 and 100 characters' });
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) errors.push({ field: 'email', message: 'Enter a valid email address' });
  if (isRegistration && (typeof password !== 'string' || password.length < 8 || password.length > 128)) errors.push({ field: 'password', message: 'Password must be between 8 and 128 characters' });
  if (!isRegistration && typeof password !== 'string') errors.push({ field: 'password', message: 'Password is required' });
  if (phone !== undefined && (typeof phone !== 'string' || !PHONE_PATTERN.test(phone.trim()))) errors.push({ field: 'phone', message: 'Enter a valid phone number' });
  if (isRegistration && !ALLOWED_REGISTRATION_ROLES.includes(role)) errors.push({ field: 'role', message: 'Role must be CUSTOMER or TECHNICIAN' });
  if (errors.length) throw validationError('Please correct the highlighted fields', errors);
}

function signToken(user) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

function safeUser(user) { const result = user.toJSON ? user.toJSON() : { ...user }; delete result.passwordHash; return result; }

async function register(req, res, next) {
  try {
    const { name, email, phone, password, role = 'CUSTOMER' } = req.body || {};
    validateCredentials({ name, email, phone, password, role }, true);
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ success: false, message: 'An account with this email already exists', errors: [] });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, phone: phone?.trim(), passwordHash: await bcrypt.hash(password, 12), role });
    return res.status(201).json({ success: true, message: 'Registration successful', data: { user: safeUser(user), token: signToken(user) } });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: 'An account with those details already exists', errors: [] });
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    validateCredentials({ email, password });
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ success: false, message: 'Invalid email or password', errors: [] });
    if (!user.isActive) return res.status(403).json({ success: false, message: 'This account is inactive', errors: [] });
    return res.json({ success: true, message: 'Login successful', data: { user: safeUser(user), token: signToken(user) } });
  } catch (error) { return next(error); }
}

async function currentUser(req, res, next) {
  try {
    const user = await User.findById(req.auth.userId);
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'Authentication required', errors: [] });
    const data = { user: safeUser(user) };
    if (user.role === 'TECHNICIAN') data.technicianProfile = await TechnicianProfile.findOne({ userId: user._id });
    return res.json({ success: true, message: 'Authenticated user', data });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) return res.status(401).json({ success: false, message: 'Authentication required', errors: [] });
    return next(error);
  }
}

function logout(_req, res) { return res.json({ success: true, message: 'Logged out successfully', data: null }); }

module.exports = { register, login, currentUser, logout };
