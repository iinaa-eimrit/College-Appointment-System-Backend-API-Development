const Availability = require('../models/Availability');

const createSlot = async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;
    const slot = await Availability.create({
      professorId: req.user._id,
      date,
      startTime,
      endTime
    });
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSlots = async (req, res) => {
  try {
    const { professorId } = req.query;
    const slots = await Availability.find({
      professorId,
      isBooked: false,
      date: { $gte: new Date() }
    }).sort({ date: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSlot, getSlots };