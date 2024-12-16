import React, { useEffect, useRef } from "react";
import {
  useLocation,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Container } from "reactstrap";
import Navbar from "components/2dashboard/Navbars/Navbar.js";
import Footer from "components/2dashboard/Footers/Footer.js";
import Sidebar from "components/2dashboard/Sidebar/Sidebar.js";
import Header from "components/2dashboard/Headers/Header.js";
import BinHeader from "components/2dashboard/Headers/binHeader";
import routes from "routes.js";
import MainComponent from "components/MainComponent";
import ProjStatus from "components/TempComp/ProjStatus";
import ProjectHome from "components/2dashboard/Project/ProjectHome";
import ProjFavorite from "components/2dashboard/Favorite/ProjFavorite";
import FreeFavorite from "components/2dashboard/Favorite/FreeFavorite";
import ErrPage from "components/2dashboard/ErrPage";
import TreeAndGantt from "variables/TreeTable_Gantt/TreeAndGantt";
import Function from "components/2dashboard/Function/Function";
import FreeHome from "components/2dashboard/Free/FreeHome";
import axios from "./api"; // Axios 인스턴스 사용
import { useSelector } from "react-redux";

const Dashboard = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.userData);

  // 새로고침 시 JWT 토큰 확인 및 유효성 검증
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // 토큰이 없으면 로그인 페이지로 이동
    } else {
      validateToken(token); // 토큰 유효성 검증
    }
  }, [navigate]);

  // JWT 토큰 유효성 검증 함수
  const validateToken = async (token) => {
    try {
      const response = await axios.post("/validate-token", { token });
      if (!response.data.isValid) {
        localStorage.removeItem("token"); // 유효하지 않은 토큰 제거
        navigate("/login");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  // 사용자가 로그아웃하거나 세션이 만료되었을 때 처리
  useEffect(() => {
    if (user.user_pk_num === 0) {
      navigate("/login");
    }
  }, [user, navigate]);

  // 페이지 이동 시 스크롤 초기화
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainContent.current) {
      mainContent.current.scrollTop = 0;
    }
  }, [location]);

  // 조건부 렌더링을 위한 변수 설정
  const isProjReadPath = location.pathname.includes("/projdetail");

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
        {isProjReadPath ? "" : <Navbar />}
        {/* 조건부 렌더링으로 헤더 선택 */}
        {isProjReadPath ? <BinHeader /> : <Header />}
        <Routes>
          <Route path="/" element={<MainComponent />} />
          <Route path="/proj/projread/:id" element={<ProjStatus />} />
          <Route path="/proj/*" element={<ProjectHome />} />
          <Route path="/free/*" element={<FreeHome />} />
          <Route path="/projfavorite" element={<ProjFavorite />} />
          <Route path="/freefavorite" element={<FreeFavorite />} />
          <Route path="/function" element={<Function />} />
          <Route path="/err" element={<ErrPage />} />
        </Routes>
      </div>
    </>
  );
};

export default Dashboard;
