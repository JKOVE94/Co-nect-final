import React, { useRef } from "react";
import { useLocation, Route, Routes } from "react-router-dom";
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
import TaskList from "components/2dashboard/Task/TaskList";
import TaskDetail from "components/2dashboard/Task/TaskDetail";
import TaskCreate from "components/2dashboard/Task/TaskCreate";

const Dashboard = (props) => {
  const mainContent = useRef(null);
  const location = useLocation();

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
          <Route path="/task/:projectNum" element={<TaskList />} />
          <Route path="/task/detail/:taskPkNum" element={<TaskDetail />} />
          <Route path="/task/create" element={<TaskCreate />} />
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
