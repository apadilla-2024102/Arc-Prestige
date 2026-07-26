import { body } from 'express-validator';

export const validateClassCreation = [
    body('name')
        .isString()
        .isLength({ min: 3, max: 100 })
        .withMessage('Name must be between 3 and 100 characters'),
    body('description')
        .optional()
        .isString()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
    body('sport')
        .isString()
        .isIn(['archery', 'soccer', 'basketball'])
        .withMessage('Sport must be archery, soccer, or basketball'),
    body('instructorId')
        .optional()
        .isString()
        .withMessage('Instructor ID must be a string if provided'),
    body('instructorName')
        .isString()
        .notEmpty()
        .withMessage('Instructor name is required'),
    body('schedule.day')
        .isString()
        .notEmpty()
        .withMessage('Schedule day is required'),
    body('schedule.startTime')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('Start time must be in HH:MM format'),
    body('schedule.endTime')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage('End time must be in HH:MM format'),
    body('level')
        .optional()
        .isIn(['beginner', 'intermediate', 'advanced'])
        .withMessage('Level must be beginner, intermediate, or advanced'),
    body('maxCapacity')
        .optional()
        .isInt({ min: 1, max: 50 })
        .withMessage('Max capacity must be between 1 and 50')
];

export const validateStudentAssignment = [
    body('studentId')
        .isString()
        .notEmpty()
        .withMessage('Student ID is required'),
    body('studentName')
        .isString()
        .notEmpty()
        .withMessage('Student name is required')
];

export const validateParticipantAction = [
    body('participantId')
        .isString()
        .notEmpty()
        .withMessage('Participant ID is required')
];