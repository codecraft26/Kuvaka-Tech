const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path'); // Import path module

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public'))); // Serve files from the 'public' directory

// Store connected clients
let clients = [];

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected',socket.id);

  // Add client to the list
  clients.push(socket);

  // Handle incoming messages
  socket.on('message', (data) => {
    console.log('Message received:', data);
    // Broadcast the received message to all connected clients
    io.emit('message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Remove disconnected client from the list
    clients = clients.filter((client) => client !== socket);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
