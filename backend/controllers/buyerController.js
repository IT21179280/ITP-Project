const Buyer = require('../models/Buyer');
const generateId = require('../utils/generateId');
const { checkUniqueUserFields } = require('../utils/uniqueness');
const { escapeRegex } = require('../utils/helpers');

const BUYER_FIELDS = [
  'fullName',
  'username',
  'email',
  'contactNumber',
  'address',
  'accountStatus',
];

const normalize = (value) => (typeof value === 'string' ? value.trim() : value);

const buildFilter = ({ search, status }) => {
  const filter = {};

  if (status) {
    filter.accountStatus = status;
  }

  if (search && String(search).trim()) {
    const regex = new RegExp(escapeRegex(String(search).trim()), 'i');
    filter.$or = [
      { buyerId: regex },
      { fullName: regex },
      { username: regex },
      { email: regex },
      { contactNumber: regex },
      { address: regex },
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
  accountStatus: body.accountStatus || 'Active',
});

// GET /api/buyers
const getBuyers = async (req, res) => {
  const buyers = await Buyer.find(buildFilter(req.query)).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: buyers.length,
    data: buyers,
  });
};

// GET /api/buyers/:id
const getBuyerById = async (req, res) => {
  const buyer = await Buyer.findById(req.params.id);

  if (!buyer) {
    return res.status(404).json({
      success: false,
      message: 'Buyer not found.',
    });
  }

  return res.json({ success: true, data: buyer });
};

// POST /api/buyers
const createBuyer = async (req, res) => {
  const payload = buildPayload(req.body);

  const duplicateErrors = await checkUniqueUserFields(payload);
  if (Object.keys(duplicateErrors).length > 0) {
    return res.status(409).json({
      success: false,
      message: Object.values(duplicateErrors)[0],
      errors: duplicateErrors,
    });
  }

  const buyerId = await generateId('buyer', 'BUY');

  const buyer = await Buyer.create({
    ...payload,
    buyerId,
    password: req.body.password,
  });

  return res.status(201).json({
    success: true,
    message: 'Buyer added successfully.',
    data: buyer,
  });
};

// PUT /api/buyers/:id
const updateBuyer = async (req, res) => {
  const buyer = await Buyer.findById(req.params.id).select('+password');

  if (!buyer) {
    return res.status(404).json({
      success: false,
      message: 'Buyer not found.',
    });
  }

  const proposedUsername =
    req.body.username !== undefined
      ? String(req.body.username).trim().toLowerCase()
      : buyer.username;
  const proposedEmail =
    req.body.email !== undefined
      ? String(req.body.email).trim().toLowerCase()
      : buyer.email;

  const duplicateErrors = await checkUniqueUserFields({
    username: proposedUsername,
    email: proposedEmail,
    excludeId: buyer._id,
  });

  if (Object.keys(duplicateErrors).length > 0) {
    return res.status(409).json({
      success: false,
      message: Object.values(duplicateErrors)[0],
      errors: duplicateErrors,
    });
  }

  BUYER_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) {
      buyer[field] = normalize(req.body[field]);
    }
  });

  if (req.body.username !== undefined) {
    buyer.username = proposedUsername;
  }

  if (req.body.email !== undefined) {
    buyer.email = proposedEmail;
  }

  if (typeof req.body.password === 'string' && req.body.password !== '') {
    buyer.password = req.body.password;
  }

  const updatedBuyer = await buyer.save();

  return res.json({
    success: true,
    message: 'Buyer updated successfully.',
    data: updatedBuyer,
  });
};

// DELETE /api/buyers/:id
const deleteBuyer = async (req, res) => {
  const buyer = await Buyer.findByIdAndDelete(req.params.id);

  if (!buyer) {
    return res.status(404).json({
      success: false,
      message: 'Buyer not found.',
    });
  }

  return res.json({
    success: true,
    message: 'Buyer deleted successfully.',
    data: null,
  });
};

module.exports = {
  getBuyers,
  getBuyerById,
  createBuyer,
  updateBuyer,
  deleteBuyer,
};
