/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Something went wrong on the server.';
  let errors = err.errors || {};

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Please correct the highlighted fields.';
    errors = {};

    Object.keys(err.errors).forEach((field) => {
      errors[field] = err.errors[field].message;
    });
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'The requested record could not be found.';
    errors = {};
  } else if (err.code === 11000) {
    statusCode = 409;
    const field =
      Object.keys(err.keyPattern || err.keyValue || {})[0] || 'value';
    const labels = {
      staffId: 'Staff ID',
      buyerId: 'Buyer ID',
      username: 'Username',
      email: 'Email',
    };
    const label = labels[field] || 'Value';

    message = `${label} already exists.`;
    errors = { [field]: message };
  }

  if (statusCode >= 500) {
    console.error('[Server error]', err);
    message = 'Something went wrong on the server.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(Object.keys(errors).length > 0 ? { errors } : {}),
  });
};

module.exports = errorHandler;
