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
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LOGOUT } from "../../../Redux/Reducer/userDataReducer";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Nav,
  Navbar,
  Container,
  Media,
} from "reactstrap";

//Navbar는 우측 상단의 사용자 사진과 메뉴를 표시
const UserNavbar = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const user = useSelector((state) => (state.userData));
  const dispatch = useDispatch();
  useEffect(()=>{
    setUserData(user);
  },[]);
    const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userNum = userInfo.user_pk_num; //사번

  const logout = () => {
    sessionStorage.removeItem("persist:proj_pk_num");
    sessionStorage.removeItem("persist:root");
    sessionStorage.removeItem("persist:userInfo");
    sessionStorage.removeItem("token");
    document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    dispatch(LOGOUT());
    navigate("/");
  }


  return (
    <>
      <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main" >
        <Container fluid style={{position:"fixed", top: "3vh", right: "1vw"}}>
          <Link
            className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {/* Link 컴포넌트 내부에는 좌측 상단에 뜨는 이름을 설정 가능 */}
          </Link>
          {/* 검색창 */}
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center">
                  {/* 사용자 사진 */}
                  <span className="avatar avatar-sm rounded-circle">
                    <img
                      src={userData.user_pic}
                      style={{width: "100%", height: "100%"}}
                    />
                  </span>
                  {/* 사용자 이름 */}
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold">
                      {userData.user_name}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!</h6>
                </DropdownItem>
                <DropdownItem to={`/main/profile/${userNum}`} tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>계정 정보</span>
                </DropdownItem>
                {/*관리자일 경우에만 설정 메뉴가 보이도록 설정*/}
                {(userData.user_author == 2 || userData.user_author == 3) ? 
                <DropdownItem to="/manage" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>설정</span>
                </DropdownItem> : null
                }
           
                <DropdownItem divider />
                <DropdownItem onClick={(e) => logout()}>
                  <i className="ni ni-user-run" />
                  <span>로그아웃</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default UserNavbar;
