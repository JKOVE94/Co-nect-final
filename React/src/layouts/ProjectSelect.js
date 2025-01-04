import React, { useCallback, useEffect, useState } from "react";
import Slider from "react-slick";
import "../assets/css/slick/slick.css";
import "../assets/css/slick/slick-theme.css";
import { CardBody, CardTitle, Row, Col, Card } from "reactstrap";
import leftArrow from "../assets/img/icons/common/leftArrow.png";
import rightArrow from "../assets/img/icons/common/rightArrow.png";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const ProjectSelect = () => {
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const compNum = userInfo.user_fk_comp_num;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const settings = {
    dots: true,
    infinite: data.length >= 3,
    speed: 500,
    slidesToShow: Math.min(3, data.length),
    slidesToScroll: Math.min(3, data.length),
    nextArrow: (
      <img
        src={rightArrow}
        style={{
          display: data.length <= 3 ? "none" : "block",
          width: "30px",
          height: "30px",
          zIndex: 9999,
          position: "absolute",
          right: "-35px",
        }}
        alt="다음"
      />
    ),
    prevArrow: (
      <img
        src={leftArrow}
        style={{
          display: data.length <= 3 ? "none" : "block",
          width: "30px",
          height: "30px",
          zIndex: 9999,
          position: "absolute",
          left: "-35px",
        }}
        alt="이전"
      />
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, data.length),
          slidesToScroll: Math.min(2, data.length),
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  sessionStorage.setItem("persist:proj_pk_num", data.proj_pk_num);
  const user_pk_num = useSelector((state) => state.userData.user_pk_num);
  const user_author = useSelector((state) => state.userData.user_author);
  const navigate = useNavigate();

  const fetchData = useCallback(() => {
    axiosInstance
      .get(`/conect/${compNum}/proj/ProjSel/${user_pk_num}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.error("접근이 거부되었습니다. 로그인 상태를 확인하세요.");
          navigate("/");
        } else {
          setError("데이터를 불러오는데 실패했습니다.");
          console.error("데이터 로딩 실패:", error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user_pk_num, navigate, compNum]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSession = (proj_pk_num) => {
    sessionStorage.setItem("persist:proj_pk_num", proj_pk_num);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

  const renderProjectCard = (proj) => (
    <Col style={{ marginLeft: "1.5rem", zIndex: "20", zIndex: "20" }}>
      <Card
        style={{
          height: "35rem",
          width: "90%",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          zIndex: "20",
        }}
      >
        <Link
          to={`/main?proj=${proj.proj_pk_num}&user=${user_pk_num}`}
          style={{ textDecoration: "none", color: "inherit" }}
          onClick={() => {
            handleSession(proj.proj_pk_num);
          }}
        >
          <CardBody className="p-5">
            <Row style={{ maxHeight: "3rem" }}>
              <Col className="col-auto">
                <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                  <i className="fas fa-clipboard-list" />
                </div>
              </Col>
              <Col
                style={{ position: "relative", right: "2rem", width: "120%" }}
              >
                <CardTitle
                  tag="h5"
                  className="text-uppercase text-muted mb-0"
                ></CardTitle>
                <span
                  className="h3 font-weight-bold mb-0"
                  style={{ width: "10rem" }}
                >
                  {proj.proj_title.length > 8
                    ? proj.proj_title.slice(0, 8) + "..."
                    : proj.proj_title}
                </span>
              </Col>
            </Row>
            <hr
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
                  {proj.proj_content}
                </p>
              </div>
              <div className="detail-box mb-3 pt-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-calendar-alt text-success mr-2"></i>
                  <span className="font-weight-bold">프로젝트 시작일</span>
                </div>
                <p className="ml-4">{formatDate(proj.proj_startdate)}</p>
              </div>
              <div className="detail-box mb-4 pt-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-calendar-alt text-danger mr-2"></i>
                  <span className="font-weight-bold">프로젝트 마감일</span>
                </div>
                <p className="ml-4">{formatDate(proj.proj_enddate)}</p>
              </div>
            </div>
          </CardBody>
        </Link>
      </Card>
    </Col>
  );

  const renderContent = () => {
    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러: {error}</div>;

    if (data.length == 0) {
      return (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "35rem", zIndex: "9" }}
        >
          <Card
            style={{
              height: "20rem",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              zIndex: "8",
            }}
          >
            <CardBody className="text-center">
              <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
              <h3 className="font-weight-bold">
                현재 진행중인 프로젝트가 없습니다
              </h3>
              {(userInfo.user_author == 2 || userInfo.user_author == 3) ? (
                <>
                  <p className="text-muted">새 프로젝트를 시작해보세요!</p>
                  <Link to="/manage/proj/create" className="btn btn-primary mt-3">
                    프로젝트 생성하기
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-muted">프로필 설정창을 확인하세요!</p>
                  <Link to={`/main/profile/${userInfo.user_pk_num}`} className="btn btn-primary mt-3">
                    프로필 설정하기
                  </Link>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      );
    } else if (data.length === 1) {
      return (
        <div style={{ width: "30%", margin: "0 auto", zIndex: "8" }}>
          {renderProjectCard(data[0])}
        </div>
      );
    } else if (data.length <= 2) {
      return (
        <div
          style={{
            width: "60%",
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          {data.map((proj, index) => renderProjectCard(proj))}
        </div>
      );
    }

    return (
      <Slider {...settings} style={{ zIndex: "10", width: "90%" }}>
        {data.map((proj, index) => (
          <div key={index}>{renderProjectCard(proj)}</div>
        ))}
      </Slider>
    );
  };

  return (
    <div
      className="login-container align-items-center"
      style={{ zIndex: "1", height: "35rem" }}
    >
      {renderContent()}
    </div>
  );
};

export default ProjectSelect;
