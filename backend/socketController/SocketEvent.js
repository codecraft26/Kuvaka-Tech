const socketIo = require('socket.io');

// Store connected clients
let clients = [];

// Function to handle WebSocket events
function handleWebSocketEvents(server) {
    const io = socketIo(server);

    io.on('connection', async (socket) => {
        // When a new user connects
        handleNewConnection(socket);

        // When a user sends a message
        socket.on('message', async (data) => {
            await handleMessage(socket, data);
        });

        // When a user disconnects
        socket.on('disconnect', async () => {
            await handleDisconnection(socket);
        });
    });
}

// Function to handle new connections
async function handleNewConnection(socket) {
    console.log('A user connected', socket.id);

    // Add client to the list
    clients.push(socket);
    socket.emit('userCount', clients.length);
    console.log('clients', clients.length);
}

// Function to handle incoming messages
async function handleMessage(socket, data) {
    // console.log('Message received:', data);

    // Broadcast the received message to all connected clients with sender information
    socket.broadcast.emit('message', {
        message: data.message,
        sender: socket.id // Sending the socket ID as the sender information
    });
}

// Function to handle disconnection
async function handleDisconnection(socket) {
    console.log(`A user disconnected  ${socket.id}`);
    // Remove disconnected client from the list
    clients = clients.filter((client) => client !== socket);

    socket.emit('userCount', clients.length);
}

module.exports = { handleWebSocketEvents };