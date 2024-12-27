// src/components/chatting/chatroom/MessageItem.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

function MessageItem({ message }) {
  const [users, setUsers] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const compPkNum = JSON.parse(
    sessionStorage.getItem("persist:userInfo")
  ).user_fk_comp_num;

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`/conect/${compPkNum}/manage/user`);
      setUsers(response.data);
      setIsLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllUsers();
    };

    fetchData();
  }, [compPkNum]);

  useEffect(() => {
    console.log("user:");
    console.log(users);
  }, [users]);

  const findUsername = (userPkNum) => {
    const userObj = users.find((user) => user.user_pk_num == userPkNum);
    return userObj ? userObj.user_name : "";
  };

  const userPkNum = JSON.parse(
    sessionStorage.getItem("persist:userInfo")
  ).user_pk_num;
  const isUserMessage = message.sender === userPkNum;

  return isLoaded ? (
    <div
      className={`message-item ${isUserMessage ? "me-message" : "you-message"}`}
    >
      <div className="message-content">
        <p className="message-sender">{findUsername(message.sender)}</p>{" "}
        {/* 작성자 이름 표시 */}
        <p className="message-text">{message.message}</p>
        <span className="message-time">
          {new Date(message.createdAt).toLocaleDateString()}{" "}
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  ) : (
    <div></div> // 로딩 중일 때 표시할 UI
  );
}
export default MessageItem;
