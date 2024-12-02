const express = require('express');
const { 
  bookAppointment, 
  getAppointments, 
  cancelAppointment 
} = require('../controllers/appointmentController');
const { protect, isProfessor, isStudent } = require('../middleware/auth');
const router = express.Router();

router.post('/book', protect, isStudent, bookAppointment);
router.get('/', protect, getAppointments);
router.delete('/:id/cancel', protect, isProfessor, cancelAppointment);

module.exports = router;