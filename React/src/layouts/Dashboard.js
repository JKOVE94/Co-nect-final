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


const Dashboard = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userData);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    dispatch(LOGOUT());
    navigate("/login");
  };

  const verifyToken = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return false;

    try {
      const response = await axiosInstance.post("/validate-token", { token });
      return response.data.isValid;
    } catch (error) {
      console.error("토큰 검증 실패:", error);
      return false;
    }
  };

  const refreshToken = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await axiosInstance.post("/refresh-token", { token });
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
      />
      <div className="main-content" ref={mainContent}>
        {!isProjReadPath && <Navbar />}
        {isProjReadPath ? <BinHeader /> : <Header />}
        <ChatOffcanvas /> {/* 채팅 기능 관련 컴포넌트 */}
        <Routes>
          <Route path="/" element={<MainComponent />} />
          <Route path="/proj/projread/:id" element={<ProjStatus />} />
          <Route path="/proj/*" element={<ProjectHome />} />
          <Route path="/task/:projectNum" element={<TaskList />} />
          <Route path="/task/detail/:taskPkNum" element={<TaskDetail />} />
          <Route path="/task/create" element={<TaskCreate />} />
          <Route path="/projfavorite" element={<ProjFavorite />} />
          <Route path="/freefavorite" element={<FreeFavorite />} />
          <Route path="/function" element={<Function />} />
          <Route path="/err" element={<ErrPage />} />
          <Route path="/wiki/*" element={<WikiHome />}/>
          <Route path="/noti/*" element={<NotiHome />}/>
          <Route path="/file/*" element={<FileHome />}/>
          <Route path="/rec/:projPkNum/*" element={<RecHome />} />

        </Routes>
      </div>
      <ChatOffcanvas/>
      <ChatOffcnavasSet/>
    </>
  );
};

export default Dashboard;
