const Staff = require('../models/Staff');
const Buyer = require('../models/Buyer');

/**
 * Usernames and emails must be unique across both staff and buyers, because
 * the two user groups represent accounts in the same system.
 *
 * @returns {object} field-level duplicate errors
 */
const checkUniqueUserFields = async ({ username, email, excludeId }) => {
  const errors = {};
  const normalizedUsername = String(username || '').trim().toLowerCase();
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const excludeCurrent = excludeId ? { _id: { $ne: excludeId } } : {};

  if (normalizedUsername) {
    const [staffMatch, buyerMatch] = await Promise.all([
      Staff.findOne({ ...excludeCurrent, username: normalizedUsername })
        .select('_id')
        .lean(),
      Buyer.findOne({ ...excludeCurrent, username: normalizedUsername })
        .select('_id')
        .lean(),
    ]);

    if (staffMatch || buyerMatch) {
      errors.username = 'This username is already taken.';
    }
  }

  if (normalizedEmail) {
    const [staffMatch, buyerMatch] = await Promise.all([
      Staff.findOne({ ...excludeCurrent, email: normalizedEmail })
        .select('_id')
        .lean(),
      Buyer.findOne({ ...excludeCurrent, email: normalizedEmail })
        .select('_id')
        .lean(),
    ]);

    if (staffMatch || buyerMatch) {
      errors.email = 'This email is already registered.';
    }
  }

  return errors;
};

module.exports = { checkUniqueUserFields };
