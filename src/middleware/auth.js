const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } else {
      res.status(401).json({ message: 'Not authorized' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

const isProfessor = (req, res, next) => {
  if (req.user && req.user.role === 'professor') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as professor' });
  }
};

const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as student' });
  }
};

module.exports = { protect, isProfessor, isStudent };