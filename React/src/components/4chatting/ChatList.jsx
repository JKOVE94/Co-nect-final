import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { es } from "date-fns/locale";
import { useSocket } from "./SocketContext";

function ChatList(props) {
  const userInfo = JSON.parse(sessionStorage.getItem("persist:userInfo"));
  const compPkNum = userInfo.user_fk_comp_num;
  const userPkNum = userInfo.user_pk_num;
  const [projectList, setProjectList] = useState([{}]);
  const [userList, setUserList] = useState([{}]);
  const [searchValue, setSearchValue] = useState("");
  const [searchProject, setSearchProject] = useState({});
  const [searchUser, setSearchUser] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const { messages } = useSocket();

  const getAllUser = async () => {
    try {
      const response = await axios.get(`/conect/${compPkNum}/manage/user`);
      setUserList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllProject = async () => {
    try {
      const response = await axios.get(
        `/conect/${compPkNum}/manage/chatproj/${userPkNum}`
      );
      setProjectList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllUser();
      await getAllProject();
    };
    fetchData();
  }, []);

  useEffect(() => {
    const updateData = async () => {
      setSearchProject(projectList);
      setSearchUser(userList);
      setIsLoaded(true);
    };
    updateData();
  }, [projectList, userList]);

  // 검색
  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setSearchProject(
      projectList.filter((project) =>
        project.proj_title.includes(e.target.value)
      )
    );
    setSearchUser(
      userList.filter(
        (user) =>
          user.user_name.includes(e.target.value) ||
          user.user_mail.includes(e.target.value)
      )
    );
  };

  // 채팅방으로 이동
  const handleChatroom = (type, no, title) => {
    if (type === "user") {
      const otherUserPkNum = no; // 상대방 사용자 ID
      const sortedUserIds = [userPkNum, otherUserPkNum].sort((a, b) => a - b); // 숫자 크기 순으로 정렬
      const chatRoomId = `${sortedUserIds[0]}to${sortedUserIds[1]}`;
      props.setRoomInfo({ type, no: chatRoomId, title }); // no 대신 chatRoomId 사용
    } else {
      props.setRoomInfo({ type, no, title });
    }
    props.setListOrRoom(false);
  };

  //GCS에 이미지가 없을 때 처리
  const handleImageError = (event) => {
    event.target.style.display = "none"; // 이미지가 로드되지 않았을 때 숨기기
  };

  const [roomSummaries, setRoomSummaries] = useState([]);

  useEffect(() => {
    const fetchRoomSummaries = async () => {
      try {
        const userInfo = JSON.parse(sessionStorage.getItem("persist:userInfo"));
        const userPkNum = userInfo.user_pk_num;

        // 사용자 정보가 없으면 요청을 보내지 않음
        if (!userPkNum) {
          console.error("User information not found.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5002/api/chat/rooms/summary",
          {
            headers: {
              Authorization: JSON.stringify(userInfo),
            },
          }
        );
        setRoomSummaries(response.data);
      } catch (error) {
        console.error("Error fetching room summaries:", error);
      }
    };

    fetchRoomSummaries();
    console.log(roomSummaries);
  }, []);

  if (!isLoaded) {
    return <div>로딩중...</div>; // 로딩 중일 때 표시할 UI
  } else if (isLoaded) {
    return (
      <div className="chat-list-container">
        <div className="chat-header">
          <div className="searchBox">
            <i className="bi bi-search searchGlass"></i>
            <input
              type="text"
              placeholder="검색"
              className="searchBar"
              onChange={(e) => handleSearch(e)}
            />
          </div>
        </div>
        <h4 className="chat-section-title">AI 어시스턴트</h4>
        <div className="chat-item">
          <div className={`chat-icon`}>🤖</div>
          <div className="chat-content">
            <div
              className="chat-name"
              onClick={() => handleChatroom("ai", userPkNum, "코넥트")}
            >
              코넥트
            </div>
            {/* <div className="chat-message">{chat.message}</div> */}
          </div>
          {/* <div className="chat-time">{chat.time}</div> */}
          {/* {chat.unread && <span className="unread-badge">{chat.unread}</span>} */}
        </div>
        <h4 className="chat-section-title">프로젝트</h4>
        {searchProject.map((proj) => (
          <div className="chat-item" key={proj.project_pk_num}>
            <div className={`chat-icon user`}>👥</div>
            <div className="chat-content">
              <div
                className="chat-name"
                onClick={() =>
                  handleChatroom("project", proj.proj_pk_num, proj.proj_title)
                }
              >
                {proj.proj_title}
              </div>
              <div className="chat-message">{}</div>
            </div>
            {/* <div className="chat-time">{chat.time}</div>
            {chat.unread && <span className="unread-badge">{chat.unread}</span>} */}
          </div>
        ))}
        <h4 className="chat-section-title">사원 채팅</h4>
        {searchUser
          .filter((user) => user.user_pk_num != userPkNum)
          .map((user) => (
            <div className="chat-item" key={user.user_name}>
              <div className={`chat-icon user`}>
                <img
                  src={user.user_pic}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                  onError={(e) => handleImageError(e)}
                />
              </div>
              <div className="chat-content">
                <div
                  className="chat-name"
                  onClick={() =>
                    handleChatroom("user", user.user_pk_num, user.user_name)
                  }
                >
                  {user.user_name}
                </div>
                {/* <div className="chat-message">{chat.message}</div> */}
              </div>
              {/* <div className="chat-time">{chat.time}</div> */}
            </div>
          ))}
      </div>
    );
  }
}

export default ChatList;
