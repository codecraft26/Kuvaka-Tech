
# Real-Time Chat Application with Node.js (Backend) and React (Frontend)

This is a simple chat server and client application that allows users to communicate in real-time over the network using sockets. The server is implemented in Node.js, and the client interface is built with React. The application supports multiple client connections to the server simultaneously, enabling users to send and receive messages in a shared chatroom environment.




## DeployMentLink
This is Deployed link of Project

https://kuvaka-tech.onrender.com

## Features

####  Server:

- Initialization: The server starts listening on a specified port for incoming connections.
- Connection Handling: It handles multiple client connections concurrently using - asynchronous I/O.
- Broadcast Messages: Messages received from one client are broadcasted to all connected clients, excluding the sender.
- User Join/Leave Notification: Notifies other clients when a user joins or leaves the chatroom.

#### Client:

- Connection: The client connects to the server using its IP address and port.
- User Interface: A simple text-based interface implemented with React, where users - can type messages and see messages from others in real-time.
- Message Sending: Users can send messages to the server, which will then be broadcasted to other clients.
- Receiving Messages: Messages from other users are displayed in real-time, along with information about who sent the message.
- __ User Join/Leave Notification __ : Toast notifications display when a user joins or leaves the chatroom.



## Technology Used

 #### Backend: 
 Node.js with Socket.IO for handling real-time communication.
 #### Frontend: 
React.js for building the user interface.
### Socket Library: 
Socket.IO for bidirectional communication between server and client.
## Run Locally

Clone the project

```bash
  https://github.com/codecraft26/Kuvaka-Tech
```

#### For Backend

Go to the project directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```
it will run on Port http://localhost:4000

#### For Backend
Go to the project directory

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```
it will run on Port http://localhost:3000 and 
set the backend url in .env file in project directory 







## Usage

- Open the client application in your web browser by visiting http://localhost:4000.

- Type your message in the input field at the bottom and press Enter to send.
- You will see messages from other users displayed in real-time, along with notifications when users join or leave the chatroom.