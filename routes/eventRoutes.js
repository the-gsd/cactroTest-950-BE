const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEventById, updateEvent } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getEvents)
    .post(protect, authorize('organizer'), createEvent);

router.route('/:id')
    .get(getEventById)
    .put(protect, authorize('organizer'), updateEvent);

module.exports = router;
