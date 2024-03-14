import React, { useState } from 'react';
import ChatForm from './components/ChatForm';
import ChatMessage from './components/ChatMessage';
import './App.css';
import UserCount from './components/UserCount';
import useChatSocket from './hooks/useChatSocket';

const App = () => {
  const { messages, userCount, sendMessage } = useChatSocket();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="container">
      <div id="chat-container">
        <div className="userCountContainer">
          <UserCount count={userCount} />
        </div>
        <div className="chat-list-container">
          <ul id="messages" className="messages">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg.message} sender={msg.sender} />
            ))}
          </ul>
        </div>
      </div>
      <ChatForm onSubmit={handleSubmit} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
    </div>
  );
};

export default App;
