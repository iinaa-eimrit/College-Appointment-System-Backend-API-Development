# College Appointment System Backend API  

This README provides a detailed guide on setting up, running, and testing the **College Appointment System Backend API**. The project implements a backend system to facilitate appointment booking between students and professors.  

---

## Features  

- **Authentication:** Login for students and professors with JWT tokens.  
- **Time Slot Management:** Professors can specify availability.  
- **Appointment Management:** Students can view available slots and book appointments; professors can cancel them.  
- **Automated E2E Test:** Comprehensive test to validate the entire user flow.  

---

## Prerequisites  

- **Node.js:** v16 or later  
- **MongoDB:** v5 or later (local instance or in-memory for tests)  
- **Postman/Curl:** For API testing  

---

## Getting Started  

### 1. Clone the Repository  

```bash  
git clone https://github.com/your-username/college-appointment-system.git  
cd college-appointment-system  
```  

### 2. Install Dependencies  

```bash  
npm install  
```  

### 3. Setup Environment Variables  

Create a `.env` file in the root directory with the following content:  

```env  
PORT=3000  
MONGO_URI=mongodb://localhost:27017/college-appointments  
JWT_SECRET=your_secret_key  
```  

### 4. Start the Server  

```bash  
npm run dev  
```  

The server will start at `http://localhost:3000`.  

---

## API Endpoints  

### **Authentication**  

1. **Login**  
   - **POST /api/auth/login**  
   - **Payload:**  
     ```json  
     {  
       "email": "user@example.com",  
       "password": "password123"  
     }  
     ```  
   - **Response:**  
     ```json  
     {  
       "token": "JWT_TOKEN"  
     }  
     ```  

### **Availability Management**  

2. **Add Time Slots (Professor Only)**  
   - **POST /api/availability**  
   - **Headers:** `Authorization: Bearer <JWT_TOKEN>`  
   - **Payload:**  
     ```json  
     {  
       "date": "2024-01-20",  
       "startTime": "10:00",  
       "endTime": "11:00"  
     }  
     ```  

3. **Get Available Slots**  
   - **GET /api/availability**  
   - **Query Parameters:** `professorId=<PROFESSOR_ID>`  
   - **Headers:** `Authorization: Bearer <JWT_TOKEN>`  

### **Appointment Management**  

4. **Book Appointment (Student Only)**  
   - **POST /api/appointments/book**  
   - **Headers:** `Authorization: Bearer <JWT_TOKEN>`  
   - **Payload:**  
     ```json  
     {  
       "availabilityId": "AVAILABILITY_ID",  
       "professorId": "PROFESSOR_ID"  
     }  
     ```  

5. **View Appointments**  
   - **GET /api/appointments**  
   - **Headers:** `Authorization: Bearer <JWT_TOKEN>`  

6. **Cancel Appointment (Professor Only)**  
   - **DELETE /api/appointments/:id/cancel**  
   - **Headers:** `Authorization: Bearer <JWT_TOKEN>`  

---

## Automated End-to-End Test  

### Steps to Run  

1. **Install Test Dependencies:**  

   ```bash  
   npm install --save-dev mongodb-memory-server jest supertest  
   ```  

2. **Run Tests:**  

   ```bash  
   npm test  
   ```  

### Test Coverage  

The test validates the following flow:  

1. Student A1 logs in.  
2. Professor P1 logs in and adds time slots.  
3. Student A1 books an appointment with Professor P1.  
4. Student A2 books another slot with Professor P1.  
5. Professor P1 cancels Student A1's appointment.  
6. Student A1 checks their appointments to confirm cancellation.  

---

## Project Structure  

```
src/  
├── config/            # Database and configuration files  
├── controllers/       # API endpoint logic  
├── middleware/        # Authentication and authorization middleware  
├── models/            # MongoDB schemas  
├── routes/            # API routes  
├── services/          # Business logic  
├── tests/             # E2E test cases  
└── utils/             # Helper functions (e.g., token generation)  
```

---

## Troubleshooting  

### Common Issues  

1. **MongoDB Connection Issues:**  
   - Ensure MongoDB is running locally or update the `MONGO_URI` in `.env`.  

2. **JWT Errors:**  
   - Ensure `Authorization` header is correctly set in requests.  

### Debugging  

- Check server logs for detailed error messages.  
- Ensure correct `role` is assigned during user registration.  

---

## Future Enhancements  

- Add notification features for students and professors.  
- Introduce email reminders for upcoming appointments.  
- Develop a frontend UI for better user interaction.  

---  
