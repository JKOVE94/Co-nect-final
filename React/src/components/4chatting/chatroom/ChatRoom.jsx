import React, { useEffect, useRef, useState, useCallback, use } from "react";
import { useParams } from "react-router-dom";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import "./ChatRoom.css";
import { useSocket } from "../SocketContext";
import { set } from "date-fns";

function ChatRoom(props) {
  const { type, no } = useParams();
  const { joinRoom, messages, allMessagesLoaded } = useSocket();
  const [isLoading, setIsLoading] = useState(true);
  const [tempMessages, setTempMessages] = useState("");
  const [AIisReady, setAIisReady] = useState(false);

  let chatRoomTitle = "채팅방";
  if (props.roomInfo.type === "project") {
    chatRoomTitle = `${props.roomInfo.title}`;
  } else if (props.roomInfo.type === "user") {
    chatRoomTitle = `${props.roomInfo.title}`;
  } else if (props.roomInfo.type === "ai") {
    chatRoomTitle = "코넥트";
  }

  useEffect(() => {
    // console.log(
    //   "props.roomInfo.no:",
    //   props.roomInfo.no,
    //   "props.roomInfo.type:",
    //   props.roomInfo.type
    // );
    if (props.roomInfo.type && props.roomInfo.no) {
      joinRoom(props.roomInfo.no, props.roomInfo.type, props.roomInfo.no);
    }
  }, [props.roomInfo.no, props.roomInfo.type]);

  const messageListRef = useRef(null); // ref 생성

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const observer = new MutationObserver(scrollToBottom);
    if (messageListRef.current) {
      observer.observe(messageListRef.current, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      if (messageListRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    // messages가 변경될 때마다 스크롤을 아래로 내립니다.
    if (messageListRef.current) {
      setTimeout(() => {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }, 100);
    }
  }, [messages]);

  // 스크롤을 가장 아래로 내리는 useEffect
  useEffect(() => {
    if (!isLoading && messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [isLoading]); // 의존성 배열에 isLoading 추가

  // console.log("isLoading:", isLoading);
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
        <div className="chat-content-box" ref={messageListRef}>
          <MessageList
            messages={messages}
            tempMessages={tempMessages}
            roomInfo={props.roomInfo}
            AIisReady={AIisReady}
            setAIisReady={setAIisReady}
            className="chat-message-content"
          />
        </div>
        <div className="chat-input-box">
          <ChatInput
            roomInfo={props.roomInfo}
            setTempMessages={setTempMessages}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
