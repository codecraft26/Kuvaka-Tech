import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import toastr from "toastr";
import "toastr/build/toastr.css";

const useChatSocket = () => {
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0);

  const socket = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {

  
    initializeSocket();
  
    return () => {
      disconnectSocket();
    };
  },[]);



  const initializeSocket = () => {
    socket.current = io(process.env.REACT_APP_API_URL, { transports: ["websocket"] });

    socket.current.on("message", handleMessage);
    socket.current.on("userCount", handleUserCount);
    socket.current.on("newUserConnected", handleNewUserConnected);
    socket.current.on("userLeft", handleUserLeft);
  };

  const disconnectSocket = () => {
    if (socket.current) {
      socket.current.disconnect();
    }
  };

  const handleMessage = (data) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { message: data.message, sender: data.sender },
    ]);
    scrollToBottom();
  };

  const handleUserCount = (count) => {
    setUserCount(count);
  };

  const handleNewUserConnected = (newUserId) => {
    toastr.options = {
      closeButton: true,
      timeOut: 5000,
      positionClass: "toast-bottom-right",
    };
    toastr.info(`${newUserId} has joined the chat.`);
    setUserCount((prevCount) => prevCount + 1);
  };
 // when user left the chat
  const handleUserLeft = (disconnectedSocketId) => {
    toastr.options = {
      closeButton: true,
      timeOut: 5000,
      positionClass: "toast-bottom-right toast-middle",
    };
    toastr.info(`${disconnectedSocketId} has left the chat.`);
    setUserCount((prevCount) => Math.max(0, prevCount - 1));
  };
//for sending the message 
  const sendMessage = (message) => {
    if (socket.current) {
      socket.current.emit("message", { message });
      setMessages((prevMessages) => [
        ...prevMessages,
        { message, sender: "You" },
      ]);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  return { messages, userCount, sendMessage, chatContainerRef };
};

export default useChatSocket;
