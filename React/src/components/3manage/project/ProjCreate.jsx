import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";
import axiosInstance from "api/axiosInstance";

const ProjCreate = (props) => {
  // Redux에서 로그인한 유저 정보 가져오기
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const compNum = userInfo.user_fk_comp_num;
  const writer = userInfo;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    proj_title: "",
    proj_content: "",
    proj_startdate: "",
    proj_enddate: "",
    proj_status: "예정",
    proj_updated: "",
    proj_created: new Date().toISOString(), // 현재 시간 추가
    proj_fk_comp_num: props.compNum, // 로그인한 유저의 pk_num을 기본값으로 설정
    proj_fk_user_num: writer.user_pk_num, // 회사 번호도 Redux에서 가져온 값으로 설정
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 기본값 처리
    const formToSubmit = {
      ...formData,
      post_fk_user_num: formData.post_fk_user_num || "1", // 값이 없으면 "1"로 설정
      post_fk_comp_num: formData.post_fk_comp_num || "1", // 값이 없으면 "1"로 설정
      proj_created: new Date().toISOString(), // 현재 시간 추가
    };

    // console.log("Form data before submitting:", formToSubmit);

    axiosInstance
      .post(`/conect/${props.compNum}/manage/proj`, formToSubmit)
      .then((response) => {
        if (response.data !== 0) {
          navigate(-1);
        }
      })
      .catch((error) => {
        console.error("게시글 저장 중 오류:", error);
        // alert(
        //   "저장 중 오류가 발생했습니다. 오류 코드: " + error.response.status
        // );
      });
  };

  const handleBackToList = () => {
    navigate("/manage/pro"); // React Router로 리디렉션
  };

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <Card>
        <CardHeader>
          <h2>새 프로젝트 등록</h2>
          <button
            onClick={handleSubmit}
            type="submit"
            className="btn btn-primary"
          >
            등록
          </button>
        </CardHeader>
        <CardBody style={{ maxHeight: "40em", overflowY: "auto" }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="proj_title">프로젝트 명:</label>
              <input
                type="text"
                className="form-control"
                id="proj_title"
                name="proj_title"
                value={formData.proj_title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="post_fk_user_num">담당자:</label>
              <input
                type="text"
                className="form-control"
                id="post_fk_user_num"
                name="post_fk_user_num"
                value={writer.user_name}
                onChange={handleChange}
                required
                disabled // 작성자는 수정할 수 없도록 disabled 처리
              />
            </div>
            <div className="form-group">
              <label htmlFor="proj_startdate">프로젝트 시작일:</label>
              <input
                type="Date"
                className="form-control"
                id="proj_startdate"
                name="proj_startdate"
                value={formData.proj_startdate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="proj_enddate">프로젝트 마감일:</label>
              <input
                type="Date"
                className="form-control"
                id="proj_enddate"
                name="proj_enddate"
                value={formData.proj_enddate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="proj_status">프로젝트 상태:</label>
              <select
                className="form-control"
                id="proj_status"
                name="proj_status"
                value={formData.proj_status}
                onChange={handleChange}
                required
              >
                <option value="">선택하세요</option>
                <option value="계획">계획</option>
                <option value="진행중">진행중</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="proj_content">프로젝트 설명:</label>
              <textarea
                className="form-control"
                id="proj_content"
                name="proj_content"
                value={formData.post_content}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ProjCreate;
