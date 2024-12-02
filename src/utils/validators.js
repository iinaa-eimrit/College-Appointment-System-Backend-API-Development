const validateTimeSlot = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  return start < end;
};

const validateDate = (date) => {
  const appointmentDate = new Date(date);
  const today = new Date();
  return appointmentDate >= today;
};

module.exports = { validateTimeSlot, validateDate };