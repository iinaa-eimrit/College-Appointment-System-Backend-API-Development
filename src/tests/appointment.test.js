const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

describe('Appointment System E2E Test', () => {
  let professorToken, studentToken, professorId, studentId, availabilityId;

  beforeAll(async () => {
    // Create test users
    const professor = await User.create({
      name: 'Professor Test',
      email: 'professor@test.com',
      password: 'password123',
      role: 'professor'
    });
    professorId = professor._id;

    const student = await User.create({
      name: 'Student Test',
      email: 'student@test.com',
      password: 'password123',
      role: 'student'
    });
    studentId = student._id;

    // Login users
    const professorLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'professor@test.com', password: 'password123' });
    professorToken = professorLogin.body.token;

    const studentLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@test.com', password: 'password123' });
    studentToken = studentLogin.body.token;
  });

  test('Complete Appointment Flow', async () => {
    // Professor creates availability
    const availabilityResponse = await request(app)
      .post('/api/availability')
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        date: new Date().toISOString(),
        startTime: '10:00',
        endTime: '11:00'
      });
    
    expect(availabilityResponse.status).toBe(201);
    availabilityId = availabilityResponse.body._id;

    // Student books appointment
    const bookingResponse = await request(app)
      .post('/api/appointments/book')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        availabilityId,
        professorId
      });
    
    expect(bookingResponse.status).toBe(201);
    const appointmentId = bookingResponse.body._id;

    // Professor cancels appointment
    const cancelResponse = await request(app)
      .delete(`/api/appointments/${appointmentId}/cancel`)
      .set('Authorization', `Bearer ${professorToken}`);
    
    expect(cancelResponse.status).toBe(200);

    // Verify student's appointments
    const appointmentsResponse = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${studentToken}`);
    
    expect(appointmentsResponse.status).toBe(200);
    expect(appointmentsResponse.body.find(a => a._id === appointmentId).status)
      .toBe('cancelled');
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Availability.deleteMany({});
    await Appointment.deleteMany({});
    await mongoose.connection.close();
  });
});