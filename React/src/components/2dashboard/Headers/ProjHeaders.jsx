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
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import "../../../assets/css/argon-dashboard-react.css";

const Header = () => {
  const [proj, setProj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchProjectData = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`/proj/projread/${id}`)
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
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row className="h-25">
                      <Col>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          프로젝트 기본 정보
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {proj.proj_pk_num}
                        </span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-file-alt" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fas fa-calendar-alt" />{" "}
                        {proj.proj_created}
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
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 h-100">
                  <CardBody>
                    <Row className="h-25">
                      <Col>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          담당자 정보
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {proj.proj_fk_user_num}
                        </span>
                      </Col>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                          <i className="fas fa-user" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      직책: {proj.proj_tag}
                    </p>
                  </CardBody>
                </Card>
              </Col>

              {/* 일정 관리 카드 */}
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 h-100">
                  <CardBody>
                    <Row className="h-25">
                      <Col>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          일정 관리
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {proj.proj_enddate}
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
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 h-100">
                  <CardBody>
                    <Row className="h-25">
                      <Col>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          프로젝트 진행 상황
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
