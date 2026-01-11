const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('customer'), createBooking);

module.exports = router;
