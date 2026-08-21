const express = require('express');
const { listCategories, listTechnicians, getTechnician, nearbyTechnicians } = require('../controllers/technician.controller');

const router = express.Router();
router.get('/categories', listCategories);
router.get('/technicians/nearby', nearbyTechnicians);
router.get('/technicians', listTechnicians);
router.get('/technicians/:id', getTechnician);

module.exports = router;
