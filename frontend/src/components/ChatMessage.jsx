import React from 'react'

const ChatMessage = ({ message, sender }) => (
    <li className={`message ${sender === "You" ? "own-message" : "other-message"}`}>
      <div className="message-content">{message}</div>
      {sender !== "You" && <span className="sender"> - {sender}</span>}
    </li>
  );

export default ChatMessage;