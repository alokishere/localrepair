const express = require('express');
const { register, login, currentUser, logout } = require('../controllers/auth.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, currentUser);
router.get('/technician/me', requireAuth, requireRole('TECHNICIAN'), currentUser);
router.post('/logout', requireAuth, logout);

module.exports = router;
