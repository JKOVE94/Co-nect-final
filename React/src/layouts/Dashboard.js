/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import Navbar from "components/2dashboard/Navbars/Navbar.js";
import Footer from "components/2dashboard/Footers/Footer.js";
import Sidebar from "components/2dashboard/Sidebar/Sidebar.js";
import Header from "components/2dashboard/Headers/Header.js";
import routes from "routes.js";
import Item1 from "layouts/itemFrame/Item1";
import MyToDoList from "components/TempComp/MyToDOList";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router";

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
        <Navbar />
        <Header />
        <Routes>
          <Route path="/" element={<MyToDoList />} />
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
