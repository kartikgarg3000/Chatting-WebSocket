const http = require('http');
const express = require('express');
const path = require('path');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public directory
app.use(express.static(path.resolve('./public')));

// Socket.io connection and event handling
io.on('connection', (socket) => {
    console.log(`A new user has connected: ${socket.id}`);

    // Listen for user messages and broadcast them
    socket.on('user-message', (message) => {
        if (message && message.trim()) {
            io.emit("message", message);
            console.log(`Message from ${socket.id}: ${message}`);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Root route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            console.error('Error sending the HTML file:', err);
            res.status(500).send('Error loading chat application');
        }
    });
});

// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
