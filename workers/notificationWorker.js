const Queue = require('better-queue');

const notificationQueue = new Queue(function (input, cb) {
    const { type, payload } = input;

    console.log(`\n[Background Job Started] Type: ${type}`);

    if (type === 'BOOKING_CONFIRMATION') {
        const { userEmail, eventTitle } = payload;
        console.log(`[Email Simulation] Sending booking confirmation to ${userEmail} for event "${eventTitle}"`);
    } else if (type === 'EVENT_UPDATE') {
        const { eventTitle, customers } = payload;
        console.log(`[Notification Simulation] Notifying ${customers.length} customers about updates to event "${eventTitle}"`);
        customers.forEach(customer => {
            console.log(`   -> Sending update to: ${customer.email}`);
        });
    }

    setTimeout(() => {
        console.log(`[Background Job Completed] Type: ${type}\n`);
        cb(null, true);
    }, 1000);
});

module.exports = notificationQueue;
