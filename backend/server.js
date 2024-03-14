
const express = require('express');
const http = require('http');
const { handleWebSocketEvents } = require('./controller/SocketController');


// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Serve static files from the public directory
app.use(express.static('public'));
app.use(express.json());

// this is health check route for checking server is runnig or not
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy' });
}
);


// Initialize WebSocket events handling
handleWebSocketEvents(server);

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});





