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
/*eslint-disable*/
import { useEffect, useState } from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
import Logo from "../../../assets/img/logo/Logo.jsx";

// reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  Nav,
  Container,
} from "reactstrap";
import ManageNavbar from "components/2dashboard/Navbars/ManageNavbar";

var ps;

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState();
  const [isRightAccess, setIsRightAccess] = useState(false);
  const projInfoFromRoot = JSON.parse(sessionStorage.getItem("persist:root")).projData; 
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  useEffect(() => {
    const projPkNumTest = sessionStorage.getItem("persist:proj_pk_num");
    // console.log("projInfoFromRoot.proj_pk_num : " +projPkNumTest == undefined)
    // console.log("projInfoFromRoot.proj_pk_num : " +projInfoFromRoot.proj_pk_num)
    // console.log("projInfoFromRoot.proj_pk_num : " +projInfoFromRoot.proj_pk_num>0)
    // console.log("!projInfoFromRoot.proj_pk_num : " +!projInfoFromRoot.proj_pk_num)
    // console.log("!projInfoFromRoot.proj_pk_num : " +projInfoFromRoot.proj_pk_num)
    // console.log("projPkNumTest : " +projPkNumTest)
    // console.log("projPkNumTest : ", Number(projPkNumTest) > 0)
    // console.log("!projPkNumTest : " +!projPkNumTest)

    if ( !Number(projPkNumTest) > 0) { // null 또는 undefined, 빈 문자열("") 모두 포함
      setIsRightAccess(false);
    }
    else{
      setIsRightAccess(true);
    }
  },[])

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}

        <NavbarBrand className="pt-0"></NavbarBrand>
       <Link to={isRightAccess? "/main" : "/"}> <Logo /></Link> {/* 로고 */}
        <Collapse navbar isOpen={collapseOpen}>
          <Nav navbar>
            <ManageNavbar /> {/* 관리자 메뉴 */}
          </Nav>
          <hr className="my-3" />  {/* 구분선 */}
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
