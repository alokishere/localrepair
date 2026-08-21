const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { createReview, listTechnicianReviews } = require('../controllers/review.controller');

const router = express.Router();
router.post('/repairs/:repairId/review', requireAuth, requireRole('CUSTOMER'), createReview);
router.get('/technicians/:technicianId/reviews', listTechnicianReviews);

module.exports = router;
