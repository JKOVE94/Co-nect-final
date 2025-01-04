import React, { useRef, useState, useEffect } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
import ProfileHome from "components/2dashboard/profile/ProfileHome";

const Dashboard = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const user = userInfo.user_pk_num; //사번
  const compPkNum = userInfo.user_fk_comp_num; //회사번호

  const [isLoading, setIsLoading] = useState(true);
  const [isRightway, setIsRightway] = useState(false);
  const projInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).projData;
  const projNum = sessionStorage.getItem("persist:proj_pk_num");
  const [projPkNum, setProjPkNum] = useState(projNum);

  const handleLogout = () => {
    sessionStorage.removeItem("persist:proj_pk_num");
    sessionStorage.removeItem("persist:root");
    sessionStorage.removeItem("persist:userInfo");
    sessionStorage.removeItem("token");
    dispatch(LOGOUT());
    navigate("/login");
  };

  useEffect(() => {
    const projPkNumTest = sessionStorage.getItem("persist:proj_pk_num");
    // console.log("projPkNumTest: ", projPkNumTest);
    // console.log("Type of projPkNumTest:", typeof projPkNumTest); // 값의 타입을 확인
    // console.log("projPkNumTest === null:", projPkNumTest === null); // null인지 확인
    // console.log("!projPkNumTest:", !projPkNumTest); // 조건식의 결과 확인
    if (!projInfoFromRoot || !projPkNumTest || projPkNumTest === "") {
      // null 또는 undefined, 빈 문자열("") 모두 포함
      navigate("/");
    } else {
      setIsRightway(true);
    }
  }, [navigate]); // navigate를 dependency array에 추가하여 navigate 함수가 변경될 때마다 useEffect가 실행되도록 합니다.

  const isProjReadPath = location.pathname.includes("/projdetail");
  return !isRightway ? (
    <></>
  ) : (
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
          <Route path="/" element={<MainComponent projPkNum={projPkNum} />} />
          <Route
            path="/proj/projread/:id"
            element={<ProjStatus projPkNum={projPkNum} />}
          />
          <Route
            path="/proj/*"
            element={<ProjectHome projPkNum={projPkNum} />}
          />
          <Route path="/task/*" element={<TaskHome projPkNum={projPkNum} />} />
          <Route
            path="/projfavorite"
            element={<ProjFavorite projPkNum={projPkNum} />}
          />
          <Route
            path="/freefavorite"
            element={<FreeFavorite projPkNum={projPkNum} />}
          />
          <Route
            path="/function"
            element={<Function projPkNum={projPkNum} />}
          />
          <Route path="/wiki/*" element={<WikiHome projPkNum={projPkNum} />} />
          <Route path="/noti/*" element={<NotiHome projPkNum={projPkNum} />} />
          <Route path="/file/*" element={<FileHome projPkNum={projPkNum} />} />
          <Route path="/rec/*" element={<RecHome projPkNum={projPkNum} />} />
          <Route path={`/profile/*`} element={<ProfileHome />} />
        </Routes>
      </div>
      <ChatOffcanvas />
      <ChatOffcnavasSet />
    </>
  );
};

export default Dashboard;
