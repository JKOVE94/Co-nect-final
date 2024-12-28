import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";

const FreeCreate = () => {
  // Redux에서 로그인한 유저 정보 가져오기
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const writer = JSON.parse(userInfoFromRoot);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    post_targetnum: "",
    post_name: "",
    post_fk_user_num: writer.user_pk_num || "1", // 로그인한 유저의 pk_num을 기본값으로 설정
    post_fk_comp_num: writer.user_fk_comp_num || "1", // 회사 번호도 Redux에서 가져온 값으로 설정
    post_import: "",
    post_content: "",
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
      regdate: new Date().toISOString(), // 현재 시간 추가
      post_kind: "1", // 기본값
      post_fk_dpart_num: "1", // 기본값
      post_tag: "red", // 기본값
    };

    // console.log("Form data before submitting:", formToSubmit);

    axios
      .post("/board/free", formToSubmit)
      .then((response) => {
        if (response.data !== 0) {
          navigate(`/main/free/detail/${response.data}`);
        }
      })
      .catch((error) => {
        console.error("게시글 저장 중 오류:", error);
        alert(
          "저장 중 오류가 발생했습니다. 오류 코드: " + error.response.status
        );
      });
  };

  const handleBackToList = () => {
    navigate("/main/free"); // React Router로 리디렉션
  };

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <Card>
        <CardHeader>
          <h2>새 게시글 작성</h2>
        </CardHeader>
        <CardBody style={{ maxHeight: "40em", overflowY: "auto" }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="post_name">제목:</label>
              <input
                type="text"
                className="form-control"
                id="post_name"
                name="post_name"
                value={formData.post_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="post_fk_user_num">작성자:</label>
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
              <label htmlFor="post_import">우선순위:</label>
              <select
                className="form-control"
                id="post_import"
                name="post_import"
                value={formData.post_import}
                onChange={handleChange}
                required
              >
                <option value="">선택하세요</option>
                <option value="높음">높음</option>
                <option value="중간">중간</option>
                <option value="낮음">낮음</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="post_content">내용:</label>
              <textarea
                className="form-control"
                id="post_content"
                name="post_content"
                value={formData.post_content}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button
              onClick={handleSubmit}
              type="submit"
              className="btn btn-primary"
            >
              게시글 저장
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBackToList}
            >
              목록
            </button>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FreeCreate;
