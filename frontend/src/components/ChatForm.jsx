import React from 'react'

const ChatForm = ({ onSubmit, value, onChange }) => (
    <form id="form" onSubmit={onSubmit}>
      
      <input
        id="input"
        autoComplete="off"
        placeholder="Type a message..."
        value={value}
        onChange={onChange}
      />
      <button type="submit">Send</button>
    </form>
  );
export default ChatForm;