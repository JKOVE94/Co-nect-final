import React, { useCallback, useEffect, useState } from "react";
import Slider from "react-slick";
import "../assets/css/slick/slick.css";
import "../assets/css/slick/slick-theme.css";
import { CardBody, CardTitle, Row, Col, Card } from "reactstrap";
import leftArrow from "../assets/img/icons/common/leftArrow.png";
import rightArrow from "../assets/img/icons/common/rightArrow.png";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

const ProjectSelect = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: (
      <img
        src={rightArrow}
        style={{ display: "block", width: "30px", height: "30px" }}
        alt="다음"
      />
    ),
    prevArrow: (
      <img
        src={leftArrow}
        alt="이전"
        style={{ display: "block", width: "30px", height: "30px" }}
      />
    ),
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user_pk_num = useSelector((state) => state.userData.user_pk_num);

  const fetchData = useCallback(() => {
    if (!user_pk_num) {
      setError("사용자 정보를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    axios
      .get(`/proj/ProjSel/${user_pk_num}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error("데이터 로딩 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user_pk_num]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

  return (
    <div
      className="login-container align-items-center"
      style={{ zIndex: "1", height: "25rem" }}
    >
      <Slider {...settings} style={{ zIndex: "8", width: "90%" }}>
        {data.map((proj, index) => (
          <div key={index}>
            <Col style={{ marginLeft: "1.5rem" }}>
              <Card
                style={{
                  height: "35rem",
                  width: "90%",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              >
                <Link
                  to={`/main`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <CardBody className="p-5">
                    <Row style={{ maxHeight: "3rem" }}>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                          <i className="fas fa-clipboard-list" />
                        </div>
                      </Col>
                      <Col style={{ position: "relative", right: "2rem" }}>
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        ></CardTitle>
                        <span className="h3 font-weight-bold mb-0">
                          {proj.proj_name}
                        </span>
                      </Col>
                    </Row>
                    <hr
                      className=""
                      style={{
                        backgroundColor: "#43A09F",
                        opacity: "0.5",
                        width: "100%",
                      }}
                    />

                    <div className="project-details">
                      <div className="detail-box mb-4">
                        <h4 className="font-weight-bold text-primary mb-3">
                          프로젝트 설명
                        </h4>
                        <p
                          style={{
                            maxHeight: "100px",
                            overflowY: "auto",
                            padding: "10px",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "5px",
                          }}
                        >
                          {proj.proj_desc}
                        </p>
                      </div>

                      <div className="detail-box mb-3 pt-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-calendar-alt text-success mr-2"></i>
                          <span className="font-weight-bold">
                            프로젝트 시작일
                          </span>
                        </div>
                        <p className="ml-4">
                          {formatDate(proj.proj_startdate)}
                        </p>
                      </div>

                      <div className="detail-box mb-4 pt-3">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fas fa-calendar-alt text-danger mr-2"></i>
                          <span className="font-weight-bold">
                            프로젝트 마감일
                          </span>
                        </div>
                        <p className="ml-4">{formatDate(proj.proj_enddate)}</p>
                      </div>

                      <div className="detail-box pt-4">
                        <h5 className="font-weight-bold mb-2">
                          진행도: {proj.proj_progress}%
                        </h5>
                        <div className="progress" style={{ height: "20px" }}>
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${proj.proj_progress}%` }}
                            aria-valuenow={proj.proj_progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Link>
              </Card>
            </Col>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProjectSelect;
