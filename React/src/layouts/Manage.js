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
import MNavbar from "components/2dashboard/Navbars/MNavbar.js";
import Footer from "components/2dashboard/Footers/Footer.js";
import MSidebar from "components/2dashboard/Sidebar/MSidebar.js";
import Header from "components/2dashboard/Headers/Header.js";
import routes from "routes.js";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import UserHome from "components/3manage/user/UserHome";
import UserInfo from "components/3manage/user/UserInfo";
import UserAdd from "components/3manage/user/UserAdd";
import UserUnlock from "components/3manage/user/UserUnlock";

const Dashboard = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => (state.userData));
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  useEffect(()=>{
    if(user.user_fk_acc_authornum !== 3){
      navigate("/");
    }
  },[]);

  return (
    <>
      <MSidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <MNavbar />
        <Header />
        <Container fluid style={{overflow:"scroll", marginTop:"1em"}}>
          <Routes>
            <Route path="user/*" element={<UserHome />}/>          
       </Routes>
        </Container>
      </div>
    </>
  );
};

export default Dashboard;
