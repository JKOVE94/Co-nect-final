// src/components/chatting/chatroom/ChatInput.jsx
import React, { useState } from "react";
import { useSocket } from "../SocketContext"; // useSocket import

function ChatInput(props) {
  const [message, setMessage] = useState("");
  const { sendMessage } = useSocket(); // sendMessage 함수 가져오기

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim() !== "") {
      sendMessage(
        props.roomInfo.no,
        message,
        props.roomInfo.type,
        props.roomInfo.no
      );
      props.setTempMessages(message);
      setMessage("");
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="메시지를 입력하세요"
        value={message}
        onChange={handleInputChange}
      />
      <button type="submit">전송</button>
    </form>
  );
}

export default ChatInput;
