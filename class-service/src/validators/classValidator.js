const Joi = require('joi');

const classSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().max(500),
  instructorId: Joi.string().required(),
  instructorName: Joi.string().required(),
  schedule: Joi.object({
    day: Joi.string().required(),
    startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
    endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
  }),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  maxCapacity: Joi.number().integer().min(1).max(50),
});

const validateClass = (data) => {
  return classSchema.validate(data);
};

module.exports = { validateClass };
