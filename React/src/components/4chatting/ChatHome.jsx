import React, { useState, useEffect, use } from "react";
import { Routes, Route } from "react-router-dom";
import "./Chatting.css"; // CSS 파일 import
import ChatList from "./\bChatList";
import ChatRoom from "./chatroom/ChatRoom";
import { SocketProvider } from "./SocketContext";

const ChatHome = () => {
  const [listOrRoom, setListOrRoom] = useState(true); // true: list, false: room
  const [roomInfo, setRoomInfo] = useState({
    type: "",
    no: 0,
    title: "",
  });

  useEffect(() => {
    console.log(roomInfo);
  }, [roomInfo]);

  useEffect(() => {
    console.log(listOrRoom);
  }, [listOrRoom]);

  return (
    <>
      <SocketProvider>
        {listOrRoom ? (
          <ChatList setListOrRoom={setListOrRoom} setRoomInfo={setRoomInfo} />
        ) : (
          <ChatRoom
            setListOrRoom={setListOrRoom}
            setRoomInfo={setRoomInfo}
            roomInfo={roomInfo}
          />
        )}
      </SocketProvider>
    </>
  );
};

export default ChatHome;
