import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "assets/css/3manage/useradd.css";
import ManageUserAddModal from "../../../variables/Modal/ManageUserAddModal";
import axiosInstance from "api/axiosInstance";
import { FaUser, FaIdCard, FaEnvelope } from "react-icons/fa"; // 아이콘 import

const Profile = (props) => {
  const nav = useNavigate();
  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  // const userPkNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호

  const [formData, setFormData] = useState({});
  const formRef = useRef(null);
  const [showM, setShowM] = useState(false); // 모달 상태와 관련된 state
  const handleCloseM = () => setShowM(false); // 모달을 닫는 함수
  const handleShowM = () => setShowM(true); // 모달을 여는 함수
  const [type, setType] = useState(""); // 모달 타입을 결정하는 state

  const { userNum } = useParams();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "user_picfile") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleAction = () => {
    nav(`/main/profile/${userNum}/edit`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/conect/${compNum}/manage/user/${userNum}`
        );
        setFormData(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();

    return () => {
      // 정리(cleanup) 함수
    };
  }, []);

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <Row className="justify-content-center">
        {" "}
        {/* 가운데 정렬 */}
        <Col>
          {" "}
          {/* 중간 크기 화면에서 8/12 너비 차지 */}
          <Card
            style={{
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <CardHeader
              style={{
                color: "white",
                padding: "1rem 1.25rem",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              }}
            >
              <h2 className="mb-0">내 정보</h2>
              <button
                className="btn btn-primary float-right"
                onClick={handleAction}
              >
                수정
              </button>{" "}
              {/* 버튼 스타일 변경 */}
            </CardHeader>
            <CardBody style={{ padding: "20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <img
                  src={formData.user_pic}
                  alt="User"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #ddd",
                    marginRight: "20px",
                    boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
                  }}
                />
                <div>
                  <h3 style={{ fontWeight: "bold", marginBottom: "5px" }}>
                    {formData.user_name}
                  </h3>
                  <br />
                  <p>
                    <FaIdCard className="mr-2" /> <b>사번:</b>{" "}
                    {formData.user_pk_num}
                  </p>{" "}
                  {/* 아이콘 추가 */}
                  <p>
                    <FaUser className="mr-2" /> <b>아이디:</b>{" "}
                    {formData.user_id}
                  </p>
                  <p>
                    <FaEnvelope className="mr-2" /> <b>이메일:</b>{" "}
                    {formData.user_mail}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
