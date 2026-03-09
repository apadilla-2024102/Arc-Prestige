const Joi = require('joi');

const attendanceSchema = Joi.object({
    classId: Joi.string().required(),
    studentId: Joi.string().required(),
    studentName: Joi.string().required().min(3).max(100),
    date: Joi.date().max('now'),
    status: Joi.string().valid('present', 'absent', 'late', 'excused').required(),
    notes: Joi.string().max(500),
});

const validateAttendance = (data) => {
    return attendanceSchema.validate(data);
};

module.exports = { validateAttendance };
