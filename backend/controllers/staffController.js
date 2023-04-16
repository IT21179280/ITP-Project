const Staff = require('../models/Staff');
const generateId = require('../utils/generateId');
const { checkUniqueUserFields } = require('../utils/uniqueness');
const { escapeRegex } = require('../utils/helpers');

const STAFF_FIELDS = [
  'fullName',
  'username',
  'email',
  'contactNumber',
  'address',
  'gender',
  'position',
  'department',
  'accountStatus',
];

const normalize = (value) => (typeof value === 'string' ? value.trim() : value);

const buildFilter = ({ search, status, department }) => {
  const filter = {};

  if (status) {
    filter.accountStatus = status;
  }

  if (department) {
    filter.department = department;
  }

  if (search && String(search).trim()) {
    const regex = new RegExp(escapeRegex(String(search).trim()), 'i');
    filter.$or = [
      { staffId: regex },
      { fullName: regex },
      { username: regex },
      { email: regex },
      { contactNumber: regex },
      { position: regex },
      { department: regex },
    ];
  }

  return filter;
};

const buildPayload = (body) => ({
  fullName: String(body.fullName).trim(),
  username: String(body.username).trim().toLowerCase(),
  email: String(body.email).trim().toLowerCase(),
  contactNumber: String(body.contactNumber).trim(),
  address: String(body.address).trim(),
  gender: body.gender,
  position: String(body.position).trim(),
  department: String(body.department).trim(),
  accountStatus: body.accountStatus || 'Active',
});

// GET /api/staff
const getStaff = async (req, res) => {
  const staff = await Staff.find(buildFilter(req.query)).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: staff.length,
    data: staff,
  });
};

// GET /api/staff/:id
const getStaffById = async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    return res.status(404).json({
      success: false,
      message: 'Staff member not found.',
    });
  }

  return res.json({ success: true, data: staff });
};

// POST /api/staff
const createStaff = async (req, res) => {
  const payload = buildPayload(req.body);

  const duplicateErrors = await checkUniqueUserFields(payload);
  if (Object.keys(duplicateErrors).length > 0) {
    return res.status(409).json({
      success: false,
      message: Object.values(duplicateErrors)[0],
      errors: duplicateErrors,
    });
  }

  const staffId = await generateId('staff', 'STF');

  const staff = await Staff.create({
    ...payload,
    staffId,
    password: req.body.password,
  });

  return res.status(201).json({
    success: true,
    message: 'Staff member added successfully.',
    data: staff,
  });
};

// PUT /api/staff/:id
const updateStaff = async (req, res) => {
  const staff = await Staff.findById(req.params.id).select('+password');

  if (!staff) {
    return res.status(404).json({
      success: false,
      message: 'Staff member not found.',
    });
  }

  const proposedUsername =
    req.body.username !== undefined
      ? String(req.body.username).trim().toLowerCase()
      : staff.username;
  const proposedEmail =
    req.body.email !== undefined
      ? String(req.body.email).trim().toLowerCase()
      : staff.email;

  const duplicateErrors = await checkUniqueUserFields({
    username: proposedUsername,
    email: proposedEmail,
    excludeId: staff._id,
  });

  if (Object.keys(duplicateErrors).length > 0) {
    return res.status(409).json({
      success: false,
      message: Object.values(duplicateErrors)[0],
      errors: duplicateErrors,
    });
  }

  STAFF_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) {
      staff[field] = normalize(req.body[field]);
    }
  });

  if (req.body.username !== undefined) {
    staff.username = proposedUsername;
  }

  if (req.body.email !== undefined) {
    staff.email = proposedEmail;
  }

  // An empty password field means "keep the current password".
  if (typeof req.body.password === 'string' && req.body.password !== '') {
    staff.password = req.body.password;
  }

  const updatedStaff = await staff.save();

  return res.json({
    success: true,
    message: 'Staff member updated successfully.',
    data: updatedStaff,
  });
};

// DELETE /api/staff/:id
const deleteStaff = async (req, res) => {
  const staff = await Staff.findByIdAndDelete(req.params.id);

  if (!staff) {
    return res.status(404).json({
      success: false,
      message: 'Staff member not found.',
    });
  }

  return res.json({
    success: true,
    message: 'Staff member deleted successfully.',
    data: null,
  });
};

module.exports = {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};
