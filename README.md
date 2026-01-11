## Design and implement the backend APIs for an Event Booking System.

DB - mongodb,
backend - express.js,
ODM - mongoose

Event Booking System
==================================

Features Implemented
--------------------

1.  **Authentication & Authorization**
    *   JWT-based authentication.        
    *   Role-based access control (Organizer and Customer).
    *   endpoints: /api/auth/register, /api/auth/login.
        
2.  **Event Management**
    *   Organizers can Create and Update events.
    *   Public access to view events.
    *   **Background Task**: Updating an event triggers a notification to all booked customers.
        
3.  **Booking System**
    *   Customers can book tickets.
    *   available ticket count decremented.
    *   **Background Task**: Booking triggers a confirmation email simulation.
        
4.  **Background Tasks**
    *   Implemented using better-queue (in-memory) for simplicity and reliability in this environment.
    *   Simulates Email Sending and Notifications with a 1-second delay.

Verification Script
--------------------

I created a script verify\_system.js that runs the full flow.

How to Run
----------

1.  npm install
    
2.  npm start
    
3.  node verify\_system.js
