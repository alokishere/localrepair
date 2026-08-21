const express = require('express');
const { diagnose } = require('../controllers/diagnosis.controller');

const router = express.Router();
router.post('/diagnosis', diagnose);

module.exports = router;
