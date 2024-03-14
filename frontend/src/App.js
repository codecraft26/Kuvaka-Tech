import React from 'react'
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import toastr from "toastr";
import "toastr/build/toastr.css";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import "./App.css";
import UserCount from './components/UserCount';
const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [userCount, setUserCount] = useState(0);

  const chatContainerRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:4000", { transports: ["websocket"] });

    socket.current.on("message", (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: data.message, sender: data.sender },
      ]);
      scrollToBottom();
    });

    socket.current.on("userCount", (count) => {
      setUserCount(count);
    });

    socket.current.on("newUserConnected", (newUserId) => {
      toastr.options = {
        closeButton: true,
        timeOut: 5000,
        positionClass: "toast-bottom-right",
      };
      toastr.info(`${newUserId} has joined the chat.`);
      setUserCount((prevCount) => prevCount + 1);
    });

    socket.current.on("userLeft", (disconnectedSocketId) => {
      toastr.options = {
        closeButton: true,
        timeOut: 5000,
        positionClass: "toast-bottom-right toast-middle",
      };
      toastr.info(`${disconnectedSocketId} has left the chat.`);
      setUserCount((prevCount) => Math.max(0, prevCount - 1));
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      if (socket.current) {
        socket.current.emit("message", { message: inputValue });
        setMessages((prevMessages) => [
          ...prevMessages,
          { message: inputValue, sender: "You" },
        ]);
        scrollToBottom();
      }
      setInputValue("");
    }
  };

  const scrollToBottom = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  return (
    <div className="container">
      <div id="chat-container" ref={chatContainerRef}>
        <div className='userCountContainer'>
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