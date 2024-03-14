import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import "./App.css";

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
        {/* <h3 id="user-count">Users Online: {userCount}</h3> */}
        <div className="chat-list-container">
          <ul id="messages" className="messages">
            {messages.map((msg, index) => (
              <li
                key={index}
                className={`message ${
                  msg.sender === "You" ? "own-message" : "other-message"
                }`}
              >
                <div className="message-content">{msg.message}</div>
                {msg.sender !== "You" && (
                  <span className="sender"> - {msg.sender}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <form id="form" onSubmit={handleSubmit}>
         <p id="user-count">Users Online: {userCount}</p>
        <input
          id="input"
          autoComplete="off"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default App;