const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');

const bookAppointment = async (req, res) => {
  try {
    const { availabilityId, professorId } = req.body;
    
    const availability = await Availability.findById(availabilityId);
    if (!availability || availability.isBooked) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    const appointment = await Appointment.create({
      studentId: req.user._id,
      professorId,
      availabilityId
    });

    availability.isBooked = true;
    await availability.save();

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAppointments = async (req, res) => {
  try {
    const query = req.user.role === 'student' 
      ? { studentId: req.user._id }
      : { professorId: req.user._id };
    
    const appointments = await Appointment.find(query)
      .populate('studentId', 'name email')
      .populate('professorId', 'name email')
      .populate('availabilityId');
    
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.professorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    const availability = await Availability.findById(appointment.availabilityId);
    availability.isBooked = false;
    await availability.save();

    res.json({ message: 'Appointment cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { bookAppointment, getAppointments, cancelAppointment };