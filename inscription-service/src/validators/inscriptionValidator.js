const Joi = require('joi');

const inscriptionSchema = Joi.object({
    studentName: Joi.string().required().min(3).max(100),
    studentEmail: Joi.string().email().required(),
    studentPhone: Joi.string().required().pattern(/^[0-9+\-\s()]+$/).min(7),
    dateOfBirth: Joi.date().required().max('now'),
    guardianName: Joi.string().max(100),
    guardianPhone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(7),
    experience: Joi.string().valid('none', 'beginner', 'intermediate', 'advanced'),
});

const validateInscription = (data) => {
    return inscriptionSchema.validate(data);
};

module.exports = { validateInscription };
