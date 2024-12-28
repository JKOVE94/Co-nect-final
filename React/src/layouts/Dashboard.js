import React, { useEffect, useRef, useState } from "react";
import { useLocation, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "components/2dashboard/Navbars/Navbar.js";
import Sidebar from "components/2dashboard/Sidebar/Sidebar.js";
import Header from "components/2dashboard/Headers/Header.js";
import BinHeader from "components/2dashboard/Headers/binHeader";
import routes from "routes.js";
import MainComponent from "components/MainComponent";
import ProjStatus from "components/TempComp/ProjStatus";
import ProjectHome from "components/2dashboard/Project/ProjectHome";
import ProjFavorite from "components/2dashboard/Favorite/ProjFavorite";
import FreeFavorite from "components/2dashboard/Favorite/FreeFavorite";
import Function from "components/2dashboard/Function/Function";
import FreeHome from "components/2dashboard/Free/FreeHome";
import WikiHome from "components/2dashboard/Wiki/WikiHome";
import NotiHome from "components/2dashboard/Noti/NotiHome";
import FileHome from "components/2dashboard/File/FileHome";
import ChatOffcanvas from "components/4chatting/ChatOffcanvas";
import ChatOffcnavasSet from "components/4chatting/ChatOffcnavasSet";
import axiosInstance from "../api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../Redux/Reducer/userDataReducer";
import TaskList from "components/2dashboard/Task/TaskList";
import TaskDetail from "components/2dashboard/Task/TaskDetail";
import RecHome from "components/2dashboard/recommendation/RecHome";
import TaskCreate from "components/2dashboard/Task/TaskCreate";
import TaskHome from "components/2dashboard/Task/TaskHome";


const Dashboard = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userData);
  const [isLoading, setIsLoading] = useState(true);
  const userInfoFromRoot = JSON.parse(sessionStorage.getItem("persist:root")).userData;
  const projInfoFromRoot = JSON.parse(sessionStorage.getItem("persist:root")).projData;  
  const userInfo = JSON.parse(userInfoFromRoot);
  const [projPkNum, setProjPkNum] = useState(JSON.parse(projInfoFromRoot).proj_pk_num);

  const handleLogout = () => {
    sessionStorage.removeItem("persist:proj_pk_num");
    sessionStorage.removeItem("persist:root");
    sessionStorage.removeItem("persist:userInfo");
    sessionStorage.removeItem("token");
    dispatch(LOGOUT());
    navigate("/login");
  };

  const verifyToken = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await axiosInstance.post("/conect/validate-token", { token });
      return response.data.isValid;
    } catch (error) {
      console.error("토큰 검증 실패:", error);
      return false;
    }
  };

  const refreshToken = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axiosInstance.post("/conect/refresh-token", { token });
      const newToken = response.data.token;
      sessionStorage.setItem("token", newToken);
      return true;
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) {
        handleLogout();
        return;
      }

      const isValid = await verifyToken();
      if (!isValid) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          handleLogout();
          return;
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();

    const tokenRefreshInterval = setInterval(refreshToken, 15 * 60 * 1000);

    return () => clearInterval(tokenRefreshInterval);
  }, []);

  useEffect(() => {
    if (!isLoading && user.user_pk_num === 0) {
      navigate("/");
    }
  }, [user, navigate, isLoading]);

  const isProjReadPath = location.pathname.includes("/projdetail");

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
        setProjPkNum={setProjPkNum}
      />
      <div className="main-content" ref={mainContent}>
        {!isProjReadPath && <Navbar />}
        {isProjReadPath ? <BinHeader /> : <Header />}
        <ChatOffcanvas /> {/* 채팅 기능 관련 컴포넌트 */}
        <Routes>
          <Route path="/" element={<MainComponent projPkNum={projPkNum}/>} />
          <Route path="/proj/projread/:id" element={<ProjStatus projPkNum={projPkNum}/>} />
          <Route path="/proj/*" element={<ProjectHome projPkNum={projPkNum}/>} />
          <Route path="/task/*" element={<TaskHome projPkNum={projPkNum}/>} />
          <Route path="/projfavorite" element={<ProjFavorite projPkNum={projPkNum}/>} />
          <Route path="/freefavorite" element={<FreeFavorite projPkNum={projPkNum}/>} />
          <Route path="/function" element={<Function projPkNum={projPkNum}/>} />
          <Route path="/wiki/*" element={<WikiHome projPkNum={projPkNum}/>}/>
          <Route path="/noti/*" element={<NotiHome projPkNum={projPkNum}/>}/>
          <Route path="/file/*" element={<FileHome projPkNum={projPkNum}/>}/>
          <Route path="/rec/:projPkNum/*" element={<RecHome projPkNum={projPkNum}/>} />

        </Routes>
      </div>
      <ChatOffcanvas/>
      <ChatOffcnavasSet/>
    </>
  );
};

export default Dashboard;
