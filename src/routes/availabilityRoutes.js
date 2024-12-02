const express = require('express');
const { createSlot, getSlots } = require('../controllers/availabilityController');
const { protect, isProfessor } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, isProfessor, createSlot);
router.get('/', protect, getSlots);

module.exports = router;