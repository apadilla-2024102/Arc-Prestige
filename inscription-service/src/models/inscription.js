const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const inscriptionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: uuidv4,
        },
        studentId: {
            type: String,
            required: true,
        },
        studentName: {
            type: String,
            required: true,
        },
        studentEmail: {
            type: String,
            required: true,
        },
        studentPhone: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        guardianName: {
            type: String,
        },
        guardianPhone: {
            type: String,
        },
        experience: {
            type: String,
            enum: ['none', 'beginner', 'intermediate', 'advanced'],
            default: 'none',
        },
        classId: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
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

module.exports = mongoose.model('Inscription', inscriptionSchema);
