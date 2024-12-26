import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import "./ChatRoom.css";
import { useSocket } from "../SocketContext";

function ChatRoom(props) {
  const { type, no } = useParams();
  const { joinRoom, messages } = useSocket();

  let chatRoomTitle = "채팅방";
  if (props.roomInfo.type === "project") {
    chatRoomTitle = `${props.roomInfo.title}`;
  } else if (props.roomInfo.type === "user") {
    chatRoomTitle = `${props.roomInfo.title}`;
  } else if (props.roomInfo.type === "ai") {
    chatRoomTitle = "코넥트";
  }

  useEffect(() => {
    console.log(
      "props.roomInfo.no:",
      props.roomInfo.no,
      "props.roomInfo.type:",
      props.roomInfo.type
    );
    if (props.roomInfo.type && props.roomInfo.no) {
      joinRoom(props.roomInfo.no, props.roomInfo.type, props.roomInfo.no);
    }
  }, [props.roomInfo.no, props.roomInfo.type]);

  return (
    <div className="chat-room">
      <div className="chat-header">
        <button
          className="back-button"
          onClick={() => props.setListOrRoom(true)}
        >
          ←
        </button>
        <h2 className="chat-title">{chatRoomTitle}</h2>
      </div>
      <div className="chat-body">
        <div className="chat-content-box">
          <MessageList
            messages={messages}
            roomInfo={props.roomInfo}
            className="chat-message-content"
          />
        </div>
        <div className="chat-input-box">
          <ChatInput roomInfo={props.roomInfo} />
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
