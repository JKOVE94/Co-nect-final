// src/components/chatting/chatroom/MessageList.jsx
import React, { useEffect, useState } from "react";
import MessageItem from "./MessageItem";

function MessageList(props) {
  return (
    <div className="chat-content-body">
      {Array.isArray(props.messages) && props.messages.length > 0 ? (
        props.messages.map((message) => (
          <MessageItem
            key={message._id}
            message={message}
            tempMessages={props.tempMessages}
            AIisReady={props.AIisReady}
            setAIisReady={props.setAIisReady}
          />
        ))
      ) : (
        <div className="no-messages">대화 내용이 없습니다.</div>
      )}
    </div>
  );
}

export default MessageList;
