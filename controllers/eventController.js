const Event = require('../models/Event');
const Booking = require('../models/Booking');
const notificationQueue = require('../workers/notificationWorker');
const catchAsync = require('../utils/catchAsync');

const createEvent = catchAsync(async (req, res) => {
    const { title, description, date, location, ticketPrice, availableTickets } = req.body;

    const event = await Event.create({
        title,
        description,
        date,
        location,
        ticketPrice,
        availableTickets,
        organizer: req.user._id
    });

    res.status(201).json(event);
});

const getEvents = catchAsync(async (req, res) => {
    const events = await Event.find().populate('organizer', 'name email');
    res.json(events);
});

const getEventById = catchAsync(async (req, res) => {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email');
    if (event) {
        res.json(event);
    } else {
        res.status(404).json({ message: 'Event not found' });
    }
});

const updateEvent = catchAsync(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    const bookings = await Booking.find({ event: event._id }).populate('user', 'email');

    const customers = bookings.map(booking => booking.user).filter((v, i, a) => a.findIndex(t => (t._id === v._id)) === i);

    if (customers.length > 0) {
        notificationQueue.push({
            type: 'EVENT_UPDATE',
            payload: {
                eventTitle: updatedEvent.title,
                customers: customers
            }
        });
    }

    res.json(updatedEvent);
});

module.exports = { createEvent, getEvents, getEventById, updateEvent };
