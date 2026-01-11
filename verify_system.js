const axios = require('axios');
const { spawn } = require('child_process');

const BASE_URL = 'http://localhost:5000/api';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runDemo() {
    console.log('--- Starting System Verification ---');

    console.log('Starting server...');
    const serverProcess = spawn('node', ['server.js'], { stdio: 'inherit' });

    await sleep(5000);

    try {
        console.log('\n--- 1. Registering Organizer ---');
        let organizerToken;
        try {
            const orgRes = await axios.post(`${BASE_URL}/auth/register`, {
                name: 'Organizer One',
                email: `organizer_${Date.now()}@test.com`,
                password: 'password123',
                role: 'organizer'
            });
            organizerToken = orgRes.data.token;
            console.log('Organizer Registered:', orgRes.data.email);
        } catch (e) {
            console.error('Registration failed:', e.response?.data || e.message);
        }

        console.log('\n--- 2. Creating Event ---');
        let eventId;
        if (organizerToken) {
            const eventRes = await axios.post(`${BASE_URL}/events`, {
                title: 'Tech Conference 2025',
                description: 'The biggest tech conference',
                date: '2025-12-01',
                location: 'San Francisco',
                ticketPrice: 100,
                availableTickets: 50
            }, {
                headers: { Authorization: `Bearer ${organizerToken}` }
            });
            eventId = eventRes.data._id;
            console.log('Event Created:', eventRes.data.title, `(ID: ${eventId})`);
        }

        console.log('\n--- 3. Registering Customer ---');
        let customerToken;
        const custRes = await axios.post(`${BASE_URL}/auth/register`, {
            name: 'Customer One',
            email: `customer_${Date.now()}@test.com`,
            password: 'password123',
            role: 'customer'
        });
        customerToken = custRes.data.token;
        console.log('Customer Registered:', custRes.data.email);

        console.log('\n--- 4. Booking Ticket (Triggers Background Task 1) ---');
        if (customerToken && eventId) {
            const bookRes = await axios.post(`${BASE_URL}/bookings`, {
                eventId: eventId,
                ticketsBooked: 2
            }, {
                headers: { Authorization: `Bearer ${customerToken}` }
            });
            console.log('Booking Successful:', bookRes.data._id);
            console.log('>> Wating for Booking Confirmation Log...');
            await sleep(2000);
        }

        console.log('\n--- 5. Updating Event (Triggers Background Task 2) ---');
        if (organizerToken && eventId) {
            const updateRes = await axios.patch(`${BASE_URL}/events/${eventId}`, {
                title: 'Tech Conference 2025 - UPDATED',
                description: 'Updated location details'
            }, {
                headers: { Authorization: `Bearer ${organizerToken}` }
            });
            console.log('Event Updated:', updateRes.data.title);
            console.log('>> Waiting for Event Update Notification Log...');
            await sleep(2000);
        }

    } catch (error) {
        console.error('An error occurred during verification:', error.message);
        if (error.response) console.error('Response data:', error.response.data);
    } finally {
        console.log('\n--- Stopping Server ---');
        serverProcess.kill();
        process.exit();
    }
}

runDemo();
