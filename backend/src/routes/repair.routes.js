const express = require('express');
const { requireAuth, requireRole } = require('../middleware/auth');
const { createRepair, listRepairs, getRepair } = require('../controllers/repair.controller');

const router = express.Router();
router.post('/repairs', requireAuth, requireRole('CUSTOMER'), createRepair);
router.get('/repairs', requireAuth, listRepairs);
router.get('/repairs/:id', requireAuth, getRepair);

module.exports = router;
