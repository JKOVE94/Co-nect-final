import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "reactstrap";
import Navbar from "components/2dashboard/Navbars/Navbar.js";
import Footer from "components/2dashboard/Footers/Footer.js";
import Sidebar from "components/2dashboard/Sidebar/Sidebar.js";
import Header from "components/2dashboard/Headers/Header.js";
import BinHeader from "components/2dashboard/Headers/binHeader";
import routes from "routes.js";
import Item1 from "layouts/itemFrame/Item1";
import MyToDoList from "components/TempComp/MyToDOList";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import ProjStatus from "components/TempComp/ProjStatus";

const Dashboard = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.userData);

  useEffect(() => {
    if (user.user_pk_num === 0) {
      navigate("/");
    }
  }, [user, navigate]);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainContent.current) {
      mainContent.current.scrollTop = 0;
    }
  }, [location]);

  // 조건부 렌더링을 위한 변수 설정
  const isProjReadPath = location.pathname.includes("/proj/projread");

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
          <Route path="/" element={<MyToDoList />} />
          <Route path="/proj/projread/:id" element={<ProjStatus />} />
        </Routes>
        <Container fluid style={{ padding: "3em" }}>
          <Item1 />
          <Footer />
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
