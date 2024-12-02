const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');

class AppointmentService {
  async bookAppointment(studentId, availabilityId, professorId) {
    const availability = await Availability.findById(availabilityId);
    if (!availability || availability.isBooked) {
      throw new Error('Slot not available');
    }

    const appointment = await Appointment.create({
      studentId,
      professorId,
      availabilityId
    });

    availability.isBooked = true;
    await availability.save();

    return appointment;
  }

  async cancelAppointment(appointmentId, professorId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    if (appointment.professorId.toString() !== professorId.toString()) {
      throw new Error('Not authorized');
    }

    appointment.status = 'cancelled';
    await appointment.save();

    const availability = await Availability.findById(appointment.availabilityId);
    availability.isBooked = false;
    await availability.save();

    return appointment;
  }

  async getUserAppointments(userId, role) {
    const query = role === 'student' ? { studentId: userId } : { professorId: userId };
    return Appointment.find(query)
      .populate('studentId', 'name email')
      .populate('professorId', 'name email')
      .populate('availabilityId');
  }
}

module.exports = new AppointmentService();