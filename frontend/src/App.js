import React, { useState,useRef ,useEffect} from 'react';
import ChatForm from './components/ChatForm';
import ChatMessage from './components/ChatMessage';
import './App.css';
import UserCount from './components/UserCount';
import useChatSocket from './hooks/useChatSocket';

const App = () => {
  const { messages, userCount, sendMessage } = useChatSocket();
  const [inputValue, setInputValue] = useState('');
  const messageListRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      sendMessage(inputValue);
      setInputValue('');
      messageListRef.current.focus();
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the message list on component mount
    messageListRef.current.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, []);

  return (
    <div className="container">
      <div className="chat-container">
        <div className="userCountContainer">
          <UserCount count={userCount} />
        </div>
        <div className="chat-list-container">
          <ul id="messages" className="messages" ref={messageListRef}>
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
