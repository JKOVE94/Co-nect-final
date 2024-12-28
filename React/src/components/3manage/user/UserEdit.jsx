import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "assets/css/3manage/useradd.css";
import ManageUserAddModal from "../../../variables/Modal/ManageUserAddModal";
import axiosInstance from "api/axiosInstance";

const UserAdd = () => {
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

  const { userPkNum } = useParams();

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
    if (formRef.current) {
      formRef.current.requestSubmit(); // 폼 요소의 submit 메서드 호출
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === "user_picfile") {
        data.append(key, formData[key]); // 파일은 그대로 추가
      } else {
        data.append(key, formData[key] !== null ? String(formData[key]) : ""); // 나머지는 문자열로 변환하여 추가
      }
    }

    try {
      const response = await axiosInstance.put(
        `/conect/${compNum}/manage/user/${userPkNum}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      switch (response.data) {
        case true: // 성공
          nav("/manage/user/info");
          break;
        case false: // 실패 - 이미지 파일이 아님
          setType("updateFail");
          handleShowM();
          break;
      }
    } catch (error) {
      console.error("등록 실패:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/conect/${compNum}/manage/user/${userPkNum}`
        );
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();

    return () => {
      // 정리(cleanup) 함수
    };
  }, [compNum, userPkNum]);

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <h2>사원 정보 수정</h2>
              <button
                className="btn btn-primary"
                style={{
                  float: "right",
                  position: "relative",
                  marginTop: "0.3em",
                }}
                onClick={handleAction}
              >
                수정 완료
              </button>
            </CardHeader>
            <CardBody style={{ maxHeight: "40em", overflowY: "auto" }}>
              <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                ref={formRef}
              >
                <input
                  type="hidden"
                  name="user_fk_comp_num"
                  value={formData.user_fk_comp_num}
                />
                <label htmlFor="user_picfile">사진</label>
                <input
                  className="form-control"
                  type="file"
                  id="user_picfile"
                  name="user_picfile"
                  onChange={handleChange}
                />
                <br />
                <label htmlFor="user_pk_num">사번</label>
                <input
                  className="form-control"
                  type="number"
                  id="user_pk_num"
                  name="user_pk_num"
                  value={formData.user_pk_num}
                  onChange={handleChange}
                  required
                />
                <br />
                <label htmlFor="user_name">이름</label>
                <input
                  className="form-control"
                  type="text"
                  id="user_name"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                />
                <br />
                <label htmlFor="user_id">아이디</label>
                <input
                  className="form-control"
                  type="text"
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  required
                />
                <br />
                <label htmlFor="user_pw">임시비밀번호</label>
                <input
                  className="form-control"
                  type="password"
                  id="user_pw"
                  name="user_pw"
                  value={formData.user_pw}
                  onChange={handleChange}
                  required
                />
                <br />
                <label htmlFor="user_mail">이메일</label>
                <input
                  className="form-control"
                  type="email"
                  id="user_mail"
                  name="user_mail"
                  value={formData.user_mail}
                  onChange={handleChange}
                  required
                />
                <br />
                <label htmlFor="user_author">계정 권한</label>
                <select
                  className="form-control"
                  id="user_author"
                  name="user_author"
                  value={formData.user_author}
                  onChange={handleChange}
                  required
                >
                  <option value="1">일반 사용자</option>
                  <option value="2">프로젝트 관리자</option>
                  <option value="3">총 관리자</option>
                  <option value="4">사용 제한</option>
                </select>
                <br />
              </form>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* <ManageUserAddModal
        handleCloseM={handleCloseM}
        handleShowM={handleShowM}
        showM={showM}
        type={type}
        datas={datas}
      /> */}
    </Container>
  );
};

export default UserAdd;
