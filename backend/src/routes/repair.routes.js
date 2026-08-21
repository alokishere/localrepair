const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { createRepair, listRepairs, getRepair, listTechnicianBookings, updateBookingStatus } = require('../controllers/repair.controller');

const router = express.Router();
router.post('/repairs', requireAuth, requireRole('CUSTOMER'), createRepair);
router.get('/repairs', requireAuth, listRepairs);
router.get('/repairs/:id', requireAuth, getRepair);
router.get('/bookings/technician', requireAuth, requireRole('TECHNICIAN'), listTechnicianBookings);
router.patch('/bookings/:id/status', requireAuth, requireRole('TECHNICIAN'), updateBookingStatus);

module.exports = router;
