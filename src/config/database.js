const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'test') {
      return; // Connection handled by test setup
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/college-appointments', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;