import React, { useEffect, useRef } from "react";
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
import ErrPage from "components/2dashboard/ErrPage";
import Function from "components/2dashboard/Function/Function";
import FreeHome from "components/2dashboard/Free/FreeHome";
import axios from "./api"; // Axios 인스턴스 사용
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../Redux/Reducer/userDataReducer";

const Dashboard = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userData);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      validateToken(token);
    }
  }, [navigate]);

  const validateToken = async (token) => {
    try {
      const response = await axios.post(
        "/validate-token",
        { token },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.data.isValid) {
        handleLogout();
      }
    } catch (error) {
      console.error("Token validation error:", error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(LOGOUT());
    navigate("/login");
  };

  useEffect(() => {
    if (user.user_pk_num === 0) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainContent.current) {
      mainContent.current.scrollTop = 0;
    }
  }, [location]);

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
        {!isProjReadPath && <Navbar />}
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
