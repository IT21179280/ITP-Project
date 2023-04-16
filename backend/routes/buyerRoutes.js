const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { validateBuyer } = require('../middleware/validateUser');
const {
  getBuyers,
  getBuyerById,
  createBuyer,
  updateBuyer,
  deleteBuyer,
} = require('../controllers/buyerController');

const router = express.Router();

router
  .route('/')
  .get(asyncHandler(getBuyers))
  .post(validateBuyer, asyncHandler(createBuyer));

router
  .route('/:id')
  .get(asyncHandler(getBuyerById))
  .put(validateBuyer, asyncHandler(updateBuyer))
  .delete(asyncHandler(deleteBuyer));

module.exports = router;
