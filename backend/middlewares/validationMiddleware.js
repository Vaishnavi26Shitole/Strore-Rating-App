const { validationResult } = require('express-validator');

exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({
      status: 'fail',
      message: errorMessages.join('. ')
    });
  };
};

exports.validatePassword = (value, { req }) => {
  if (value.length < 8 || value.length > 16) {
    throw new Error('Password must be between 8-16 characters');
  }
  if (!/[A-Z]/.test(value)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    throw new Error('Password must contain at least one special character');
  }
  return true;
};