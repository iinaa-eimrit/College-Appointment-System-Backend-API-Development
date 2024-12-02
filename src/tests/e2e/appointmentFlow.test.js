const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');
const Availability = require('../../models/Availability');
const Appointment = require('../../models/Appointment');

describe('Appointment System Complete Flow', () => {
  let professorP1, studentA1, studentA2;
  let professorToken, studentA1Token, studentA2Token;
  let timeSlotT1, timeSlotT2;

  beforeAll(async () => {
    await mongoose.connection.dropDatabase();
  });

  beforeEach(async () => {
    try {
      // Create test users
      professorP1 = await User.create({
        name: 'Professor P1',
        email: 'p1@test.com',
        password: 'password123',
        role: 'professor'
      });

      studentA1 = await User.create({
        name: 'Student A1',
        email: 'a1@test.com',
        password: 'password123',
        role: 'student'
      });

      studentA2 = await User.create({
        name: 'Student A2',
        email: 'a2@test.com',
        password: 'password123',
        role: 'student'
      });
    } catch (error) {
      console.error('Error in test setup:', error);
      throw error;
    }
  });

  test('Complete appointment flow scenario', async () => {
    // Step 1: Student A1 authenticates
    const studentA1Login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'a1@test.com', password: 'password123' });
    expect(studentA1Login.status).toBe(200);
    expect(studentA1Login.body.token).toBeDefined();
    studentA1Token = studentA1Login.body.token;

    // Step 2: Professor P1 authenticates
    const professorLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'p1@test.com', password: 'password123' });
    expect(professorLogin.status).toBe(200);
    expect(professorLogin.body.token).toBeDefined();
    professorToken = professorLogin.body.token;

    // Step 3: Professor P1 creates time slots
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const slot1Response = await request(app)
      .post('/api/availability')
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        date: tomorrow.toISOString(),
        startTime: '10:00',
        endTime: '11:00'
      });
    expect(slot1Response.status).toBe(201);
    timeSlotT1 = slot1Response.body;

    const slot2Response = await request(app)
      .post('/api/availability')
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        date: tomorrow.toISOString(),
        startTime: '14:00',
        endTime: '15:00'
      });
    expect(slot2Response.status).toBe(201);
    timeSlotT2 = slot2Response.body;

    // Step 4: Student A1 views available slots
    const availableSlotsResponse = await request(app)
      .get('/api/availability')
      .query({ professorId: professorP1._id })
      .set('Authorization', `Bearer ${studentA1Token}`);
    expect(availableSlotsResponse.status).toBe(200);
    expect(availableSlotsResponse.body.length).toBe(2);

    // Step 5: Student A1 books appointment for T1
    const bookingA1Response = await request(app)
      .post('/api/appointments/book')
      .set('Authorization', `Bearer ${studentA1Token}`)
      .send({
        availabilityId: timeSlotT1._id,
        professorId: professorP1._id
      });
    expect(bookingA1Response.status).toBe(201);

    // Step 6: Student A2 authenticates
    const studentA2Login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'a2@test.com', password: 'password123' });
    expect(studentA2Login.status).toBe(200);
    expect(studentA2Login.body.token).toBeDefined();
    studentA2Token = studentA2Login.body.token;

    // Step 7: Student A2 books appointment for T2
    const bookingA2Response = await request(app)
      .post('/api/appointments/book')
      .set('Authorization', `Bearer ${studentA2Token}`)
      .send({
        availabilityId: timeSlotT2._id,
        professorId: professorP1._id
      });
    expect(bookingA2Response.status).toBe(201);

    // Step 8: Professor P1 cancels appointment with Student A1
    const cancelResponse = await request(app)
      .delete(`/api/appointments/${bookingA1Response.body._id}/cancel`)
      .set('Authorization', `Bearer ${professorToken}`);
    expect(cancelResponse.status).toBe(200);

    // Step 9: Student A1 checks appointments
    const appointmentsA1Response = await request(app)
      .get('/api/appointments')
      .set('Authorization', `Bearer ${studentA1Token}`);
    expect(appointmentsA1Response.status).toBe(200);
    
    const activeAppointments = appointmentsA1Response.body.filter(
      app => app.status === 'booked'
    );
    expect(activeAppointments.length).toBe(0);
  });

  afterEach(async () => {
    try {
      await User.deleteMany({});
      await Availability.deleteMany({});
      await Appointment.deleteMany({});
    } catch (error) {
      console.error('Error in test cleanup:', error);
    }
  });
});