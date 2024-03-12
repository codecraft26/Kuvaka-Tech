const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static('public'));

// Store connected clients
let clients = [];

// Socket.IO logic
// Socket.IO logic
io.on('connection', (socket) => {
    console.log('A user connected', socket.id);
  
    // Add client to the list
    clients.push(socket);
  
    console.log('clients', clients.length);
  
    // Handle incoming messages
    socket.on('message', (data) => {
      console.log('Message received:', data);
  
      // Broadcast the received message to all connected clients with sender information
      socket.broadcast.emit('message', {
        message: data.message,
        sender: socket.id // Sending the socket ID as the sender information
      });
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
