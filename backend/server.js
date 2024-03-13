
const express = require('express');
const http = require('http');
const { handleWebSocketEvents } = require('./socketController/SocketEvent');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Serve static files from the public directory
app.use(express.static('public'));

// Initialize WebSocket events handling
handleWebSocketEvents(server);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});





