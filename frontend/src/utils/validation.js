const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._]{4,20}$/;
const PHONE_ALLOWED_REGEX = /^[+()\d\s-]{9,18}$/;

const baseValidation = (values) => {
  const errors = {};

  const fullName = values.fullName.trim();
  const username = values.username.trim();
  const email = values.email.trim();
  const contactNumber = values.contactNumber.trim();
  const address = values.address.trim();

  if (!fullName) errors.fullName = 'Full name is required.';
  else if (fullName.length < 3) errors.fullName = 'Full name must be at least 3 characters.';
  else if (fullName.length > 80) errors.fullName = 'Full name cannot exceed 80 characters.';

  if (!username) errors.username = 'Username is required.';
  else if (!USERNAME_REGEX.test(username)) {
    errors.username = 'Use 4-20 letters, numbers, dots or underscores.';
  }

  if (!email) errors.email = 'Email is required.';
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Enter a valid email address.';

  if (!contactNumber) {
    errors.contactNumber = 'Contact number is required.';
  } else {
    const digits = contactNumber.replace(/\D/g, '');
    if (!PHONE_ALLOWED_REGEX.test(contactNumber) || digits.length < 9 || digits.length > 15) {
      errors.contactNumber = 'Enter a valid contact number with 9-15 digits.';
    }
  }

  if (!address) errors.address = 'Address is required.';
  else if (address.length < 5) errors.address = 'Address must be at least 5 characters.';
  else if (address.length > 200) errors.address = 'Address cannot exceed 200 characters.';

  return errors;
};

const passwordValidation = (values, { isEdit }) => {
  const errors = {};
  const password = values.password || '';

  if (!isEdit && !password) {
    errors.password = 'Password is required.';
  } else if (password && password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  if (!isEdit && !values.confirmPassword) {
    errors.confirmPassword = 'Please confirm the password.';
  } else if (password && values.confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

export const validateStaffForm = (values, { isEdit = false } = {}) => {
  const errors = baseValidation(values);

  if (!values.gender) errors.gender = 'Gender is required.';
  if (!values.position) errors.position = 'Position is required.';
  if (!values.department) errors.department = 'Department is required.';

  return { ...errors, ...passwordValidation(values, { isEdit }) };
};

export const validateBuyerForm = (values, { isEdit = false } = {}) => {
  const errors = baseValidation(values);
  return { ...errors, ...passwordValidation(values, { isEdit }) };
};
