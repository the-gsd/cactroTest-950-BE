const Booking = require('../models/Booking');
const Event = require('../models/Event');
const notificationQueue = require('../workers/notificationWorker');
const catchAsync = require('../utils/catchAsync');

const createBooking = catchAsync(async (req, res) => {
    const { eventId, ticketsBooked } = req.body;
    const tickets = ticketsBooked || 1;

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    if (event.availableTickets < tickets) {
        return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const booking = await Booking.create({
        user: req.user._id,
        event: eventId,
        ticketsBooked: tickets
    });

    event.availableTickets -= tickets;
    await event.save();

    notificationQueue.push({
        type: 'BOOKING_CONFIRMATION',
        payload: {
            userEmail: req.user.email,
            eventTitle: event.title,
            bookingId: booking._id
        }
    });

    res.status(201).json(booking);
});

module.exports = { createBooking };
