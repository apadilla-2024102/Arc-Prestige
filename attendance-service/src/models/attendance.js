const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const attendanceSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        classId: {
            type: String,
            required: true,
        },
        studentId: {
            type: String,
            required: true,
        },
        studentName: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'late', 'excused'],
            required: true,
        },
        notes: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
