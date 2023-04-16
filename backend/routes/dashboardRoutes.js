const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { getDashboardStats } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/stats', asyncHandler(getDashboardStats));

module.exports = router;
