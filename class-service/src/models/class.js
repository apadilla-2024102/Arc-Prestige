const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const classSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        instructorId: {
            type: String,
            required: true,
        },
        instructorName: {
            type: String,
            required: true,
        },
        schedule: {
            day: String,
            startTime: String,
            endTime: String,
        },
        level: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'beginner',
        },
        maxCapacity: {
            type: Number,
            required: true,
            default: 15,
        },
        currentEnrollment: {
            type: Number,
            default: 0,
        },
        participants: [
            {
                studentId: String,
                studentName: String,
                enrollmentDate: { type: Date, default: Date.now },
                status: {
                    type: String,
                    enum: ['active', 'dropped', 'paused'],
                    default: 'active',
                },
            },
        ],
        status: {
            type: String,
            enum: ['active', 'inactive', 'full'],
            default: 'active',
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

module.exports = mongoose.model('Class', classSchema);
