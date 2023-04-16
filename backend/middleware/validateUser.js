const { validateUserPayload } = require('../utils/validateUser');

const sendValidationErrors = (res, errors) =>
  res.status(400).json({
    success: false,
    message: 'Please correct the highlighted fields.',
    errors,
  });

const validateStaff = (req, res, next) => {
  const errors = validateUserPayload(req.body, {
    isStaff: true,
    partial: req.method === 'PUT',
  });

  if (Object.keys(errors).length > 0) {
    return sendValidationErrors(res, errors);
  }

  return next();
};

const validateBuyer = (req, res, next) => {
  const errors = validateUserPayload(req.body, {
    isStaff: false,
    partial: req.method === 'PUT',
  });

  if (Object.keys(errors).length > 0) {
    return sendValidationErrors(res, errors);
  }

  return next();
};

module.exports = { validateStaff, validateBuyer };
