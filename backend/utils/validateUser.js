const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._]{4,20}$/;
const PHONE_ALLOWED_REGEX = /^[+()\d\s-]{9,18}$/;
const GENDERS = ['Male', 'Female', 'Other'];
const STATUSES = ['Active', 'Inactive'];

const isBlank = (value) =>
  value === undefined || value === null || String(value).trim() === '';

/**
 * Validates a staff or buyer request body.
 *
 * @param {object} body request body
 * @param {object} options
 * @param {boolean} options.isStaff include staff-only fields
 * @param {boolean} options.partial only validate fields that were sent
 * @returns {object} map of field name to error message
 */
const validateUserPayload = (body = {}, { isStaff = false, partial = false } = {}) => {
  const errors = {};
  const wasSent = (field) =>
    Object.prototype.hasOwnProperty.call(body, field);
  const shouldCheck = (field) => !partial || wasSent(field);

  if (shouldCheck('fullName')) {
    const value = typeof body.fullName === 'string' ? body.fullName.trim() : body.fullName;
    if (isBlank(value)) errors.fullName = 'Full name is required.';
    else if (String(value).length < 3) errors.fullName = 'Full name must be at least 3 characters.';
    else if (String(value).length > 80) errors.fullName = 'Full name cannot exceed 80 characters.';
  }

  if (shouldCheck('username')) {
    const value = typeof body.username === 'string' ? body.username.trim() : body.username;
    if (isBlank(value)) errors.username = 'Username is required.';
    else if (!USERNAME_REGEX.test(String(value)))
      errors.username = 'Username must be 4-20 characters using letters, numbers, dots or underscores.';
  }

  if (shouldCheck('email')) {
    const value = typeof body.email === 'string' ? body.email.trim() : body.email;
    if (isBlank(value)) errors.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(String(value))) errors.email = 'Enter a valid email address.';
  }

  if (shouldCheck('contactNumber')) {
    const value =
      typeof body.contactNumber === 'string' ? body.contactNumber.trim() : body.contactNumber;
    if (isBlank(value)) {
      errors.contactNumber = 'Contact number is required.';
    } else {
      const digits = String(value).replace(/\D/g, '');
      if (!PHONE_ALLOWED_REGEX.test(String(value)) || digits.length < 9 || digits.length > 15) {
        errors.contactNumber = 'Enter a valid contact number with 9-15 digits.';
      }
    }
  }

  if (shouldCheck('address')) {
    const value = typeof body.address === 'string' ? body.address.trim() : body.address;
    if (isBlank(value)) errors.address = 'Address is required.';
    else if (String(value).length < 5) errors.address = 'Address must be at least 5 characters.';
    else if (String(value).length > 200) errors.address = 'Address cannot exceed 200 characters.';
  }

  if (isStaff) {
    if (shouldCheck('gender')) {
      if (isBlank(body.gender)) errors.gender = 'Gender is required.';
      else if (!GENDERS.includes(body.gender)) errors.gender = 'Select a valid gender.';
    }

    if (shouldCheck('position')) {
      const value = typeof body.position === 'string' ? body.position.trim() : body.position;
      if (isBlank(value)) errors.position = 'Position is required.';
      else if (String(value).length > 60) errors.position = 'Position cannot exceed 60 characters.';
    }

    if (shouldCheck('department')) {
      const value = typeof body.department === 'string' ? body.department.trim() : body.department;
      if (isBlank(value)) errors.department = 'Department is required.';
      else if (String(value).length > 60) errors.department = 'Department cannot exceed 60 characters.';
    }
  }

  if (wasSent('accountStatus')) {
    if (isBlank(body.accountStatus)) {
      errors.accountStatus = 'Account status is required.';
    } else if (!STATUSES.includes(body.accountStatus)) {
      errors.accountStatus = 'Select a valid account status.';
    }
  }

  const passwordWasSent = wasSent('password');
  const password = typeof body.password === 'string' ? body.password : '';

  if (!partial) {
    if (!password) errors.password = 'Password is required.';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
  } else if (passwordWasSent && password !== '' && password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
};

module.exports = {
  validateUserPayload,
  GENDERS,
  STATUSES,
  EMAIL_REGEX,
  USERNAME_REGEX,
};
