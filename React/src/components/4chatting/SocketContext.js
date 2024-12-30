// src/contexts/SocketContext.js
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { io } from "socket.io-client";
const server = process.env.REACT_APP_SERVER_URL;
const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [messages, setMessages] = useState([]); // messages의 초기값을 빈 배열([])로 변경
  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userPkNum = userInfo ? userInfo.user_pk_num : null;
  const socketRef = useRef();
  const [allMessagesLoaded, setAllMessagesLoaded] = useState(false);

  useEffect(() => {
    if (userPkNum) {
      const newSocket = io(`${server}:5002/api/chat`, {
        query: {
          userId: userPkNum,
        },
      });
      socketRef.current = newSocket;

      return () => newSocket.close();
    }
  }, [userPkNum]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("loadMessages", (newMessages) => {
      setMessages(newMessages);
      setAllMessagesLoaded(true);
    });

    socket.on("newMessage", (newMessage) => {
    //   console.log("newMessage:", newMessage);
      setMessages((prevMessages) => {
        // 무조건 배열로 처리
        const updatedMessages = Array.isArray(prevMessages)
          ? [...prevMessages, newMessage]
          : [newMessage];
        // console.log("updatedMessages:", updatedMessages);
        return updatedMessages;
      });
    });

    return () => {
      socket.off("newMessage");
      socket.off("loadMessages");
    };
  }, []);

  // 메시지 전송 함수
  const sendMessage = (chatRoomId, message, type, referenceId) => {
  const socket = socketRef.current;
  if (socket && message) {
    // message가 빈 문자열이 아닌 경우에만 sendMessage 이벤트 전송
    // console.log("Sending sendMessage event:", {
    //   chatRoomId,
    //   sender: userPkNum,
    //   message, // message 속성이  undefined가 아닌지 확인
    //   type,
    //   referenceId,
    // });
    socket.emit("sendMessage", {
      chatRoomId,
      sender: userPkNum,
      message,
      type,
      referenceId,
    });
  }
};

  // 방에 입장하는 함수
  const joinRoom = (chatRoomId, type, referenceId) => {
    const socket = socketRef.current;
    if (socket) {
      socket.emit("joinRoom", {
        chatRoomId,
        type,
        referenceId,
        user: userPkNum,
      });
    }
  };

  const value = { sendMessage, joinRoom, messages,allMessagesLoaded }; // socket 제거, messages 추가

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};