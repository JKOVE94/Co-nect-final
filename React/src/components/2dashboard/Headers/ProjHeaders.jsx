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

// reactstrap components
import {
  Card,
  CardBody,
  CardTitle,
  Container,
  Row,
  Col,
  DropdownItem,
  DropdownMenu,
  Media,
  DropdownToggle,
  Nav,
  UncontrolledDropdown,
} from "reactstrap";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../../../Redux/Reducer/userDataReducer";
import { Link } from "react-router-dom";

const Header = () => {
  const [proj, setProj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const user = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  useEffect(() => {
    setUserData(user);
  }, []);

  const logout = () => {
    sessionStorage.removeItem("persist:proj_pk_num");
    sessionStorage.removeItem("persist:root");
    sessionStorage.removeItem("persist:userInfo");
    sessionStorage.removeItem("token");
    dispatch(LOGOUT());
    navigate("/");
  };

  const fetchProjectData = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`/proj/projdetail/${id}`)
      .then((res) => {
        setProj(res.data);
      })
      .catch((error) => {
        setError("프로젝트 데이터를 불러오는데 실패했습니다.");
        console.error("프로젝트 데이터 로딩 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!proj) return <p>프로젝트 정보가 없습니다.</p>;

  return (
    <>
      <div
        className="header bg-gradient-info pb-1 pt-2 pt-md-2"
        style={{ height: "10.5rem" }}
      >
        <Container fluid>
          <div className="header-body">
            {/* 사용자 프로필 */}
            <div
              className="align-items-center justify-content-end d-none d-md-flex pt-3"
              navbar
              style={{
                position: "relative",
                top: "2rem",
                right: "1rem",
              }}
            >
              <UncontrolledDropdown nav style={{ transform: "scale(1.5) " }}>
                <DropdownToggle className="pr-0" nav>
                  <Media className="align-items-center">
                    {/* 사용자 이름 */}
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold text-white">
                        {userData.user_name}
                      </span>
                      &emsp;
                    </Media>
                    {/* 사용자 사진 */}
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={require("assets/img/theme/team-4-800x800.jpg")}
                      />
                    </span>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem to="/#" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span>계정 정보</span>
                  </DropdownItem>
                  {/*관리자일 경우에만 설정 메뉴가 보이도록 설정*/}
                  {userData.user_fk_acc_authornum === 3 ? (
                    <DropdownItem to="/manage" tag={Link}>
                      <i className="ni ni-settings-gear-65" />
                      <span>설정</span>
                    </DropdownItem>
                  ) : null}
                  <DropdownItem to="#" tag={Link}>
                    <i className="ni ni-calendar-grid-58" />
                    <span>활동</span>
                  </DropdownItem>

                  <DropdownItem to="#" tag={Link}>
                    <i className="ni ni-support-16" />
                    <span>지원</span>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem onClick={(e) => logout()}>
                    <i className="ni ni-user-run" />
                    <span>로그아웃</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
            {/* Card stats */}
            <Row
              className="h-25 justify-content-start "
              style={{ position: "relative", bottom: "3rem" }}
            >
              {/* 프로젝트 제목 */}
              <Col lg="5" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 ">
                  <CardBody>
                    <Row className="h-25">
                      <Col style={{ maxHeight: "2rem" }}>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0 "
                        >
                          프로젝트 기본 정보
                        </CardTitle>
                        <span
                          className="h3 font-weight-bold mb-0 "
                          style={{ overflow: "auto" }}
                        >
                          {proj.proj_pk_num}.{proj.proj_name}
                        </span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-clipboard-list" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fas fa-calendar-alt" /> &nbsp;
                        {new Date(proj.proj_created).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </span>
                      <span className="text-nowrap">
                        {" "}
                        중요도: {proj.proj_import}
                      </span>
                    </p>
                  </CardBody>
                </Card>
              </Col>

              {/* 담당자 정보 카드 */}
              <Col lg="5" xl="2">
                <Card className="card-stats mb-4 mb-xl-0 ">
                  <CardBody>
                    <Row className="h-25 flex-nowrap">
                      <Col>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          담당자 정보
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {userData.user_name}
                        </span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                          <i className="fas fa-user" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      직책: {userData.user_rank}
                    </p>
                  </CardBody>
                </Card>
              </Col>

              {/* 일정 관리 카드 */}
              <Col lg="5" xl="2">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row className="h-25">
                      <Col>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          마감 기한
                        </CardTitle>
                        <span className="h3 font-weight-bold mb-0">
                          {new Date(proj.proj_enddate).toLocaleDateString(
                            "ko-KR",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-calendar-check" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      남은 기간: {proj.proj_progress}
                    </p>
                  </CardBody>
                </Card>
              </Col>

              {/* 프로젝트 진행 상황 카드 */}
              <Col lg="5" xl="2">
                <Card className="card-stats mb-4 mb-xl-0 ">
                  <CardBody>
                    <Row className="h-25">
                      <Col>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0 "
                        >
                          진행 상황
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {proj.proj_progress}
                        </span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="fas fa-tasks" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      상태: {proj.proj_status}
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
