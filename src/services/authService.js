const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');

class AuthService {
  async authenticateUser(email, password) {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      throw new Error('Invalid credentials');
    }
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    };
  }

  async registerUser(userData) {
    const userExists = await User.findOne({ email: userData.email });
    if (userExists) {
      throw new Error('User already exists');
    }
    const user = await User.create(userData);
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    };
  }
}

module.exports = new AuthService();