const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { validateStaff } = require('../middleware/validateUser');
const {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');

const router = express.Router();

router
  .route('/')
  .get(asyncHandler(getStaff))
  .post(validateStaff, asyncHandler(createStaff));

router
  .route('/:id')
  .get(asyncHandler(getStaffById))
  .put(validateStaff, asyncHandler(updateStaff))
  .delete(asyncHandler(deleteStaff));

module.exports = router;
