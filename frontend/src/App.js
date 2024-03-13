import React, { useState, useEffect,useRef } from 'react';
import io from 'socket.io-client';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import './App.css';
const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [userCount, setUserCount] = useState(0);

  const socket = useRef(null); // Use useRef to store the socket instance

  useEffect(() => {
    socket.current = io('http://localhost:4000', { transports: ['websocket'] });
    // Fetch initial user count on connection


    socket.current.on('message', data => {
      setMessages(prevMessages => [...prevMessages, { message: data.message, sender: data.sender }]);
    });

    socket.current.on('userCount', count => {
      setUserCount(count);
    });
// imporved when a new user joins the chat
    socket.current.on('newUserConnected', (newUserId) => {
      toastr.options = {
          closeButton: true, // Enable toast closing button
          timeOut: 5000, // Set toast duration to 5 seconds
          positionClass: 'toast-bottom-right' // Position toast in bottom right corner
      };
      toastr.info(`${newUserId} has joined the chat.`);
      setUserCount(prevCount => prevCount + 1); // Increment user count
  });

   // Improved user leaving listener with custom toast message
   socket.current.on('userLeft', (disconnectedSocketId) => {
    toastr.options = {
      closeButton: true, // Enable toast closing button
      timeOut: 5000, // Set toast duration to 5 seconds
      positionClass: 'toast-bottom-right toast-middle' // Position toast in bottom right corner
    };
    toastr.info(`${disconnectedSocketId} has left the chat.`);
    setUserCount(prevCount => Math.max(0, prevCount - 1)); // Ensure user count doesn't go negative
  });

    return () => {
      // Disconnect on unmount
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      // Use the existing socket connection
      if (socket.current) {
        socket.current.emit('message', { message: inputValue });
        setMessages(prevMessages => [...prevMessages, { message: inputValue, sender: 'You' }]);
      }
      setInputValue('');
    }
  };
  return (
    <div>
      <div id="chat-container">
        <ul id="messages">
          {messages.map((msg, index) => (
            <li key={index} className={`message ${msg.sender === 'You' ? 'own-message' : 'other-message'}`}>
              <div className="message-content">{msg.message}</div>
              {msg.sender !== 'You' && <span className="sender"> - {msg.sender}</span>}
            </li>
          ))}
        </ul>
      </div>
      <div id="user-count">Users Online: {userCount}</div>
      <form id="form" onSubmit={handleSubmit}>
        <input
          id="input"
          autoComplete="off"
          placeholder="Type a message..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;