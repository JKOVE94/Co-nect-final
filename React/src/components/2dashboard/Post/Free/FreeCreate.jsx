import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import { Row, Col, Card, CardBody, CardHeader, Container } from "reactstrap";

const FreeCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    post_targetnum: "",  
    post_name: "",        
    post_fk_user_num: "", 
    post_fk_comp_num: "1", // 기본값 1
    post_import: "",      // 기본값 빈 문자열
    post_content: "",     // 기본값 빈 문자열
  });


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const regDate = new Date().toISOString(); 
    const compNum = formData.post_fk_comp_num || "1";
  
    // 요청 데이터를 로그로 출력해서 확인
    console.log("Form data:", formData);

    const formToSubmit = {
      ...formData,
      regdate: regDate, // 현재 시간 추가
      post_fk_comp_num: formData.post_fk_comp_num || "1", // null 이거나 빈 값일 경우 기본값 "1"
      post_kind: "1",   // 기본값 "1"
      post_fk_dpart_num: "1", // 기본값 "1"
      post_tag: "red",  // 기본값 "red"
    };
    const url = "/board/free";  // 요청 URL
  
    // 요청 데이터를 확인 후 필요한 경우 수정
    axios
      .post(url, formToSubmit)
      .then((response) => {
        if(response.data.isSuccess) {
          navigate("/board/free");
        }
      })
      .catch((error) => {
        console.error("게시글 저장 중 오류:", error);
        alert("저장 중 오류가 발생했습니다. 오류 코드: " + error.response.status);
      });
  };
  

  const handleBackToList = () => {
    navigate('/main/free'); // React Router로 리디렉션
  };

  return (
    <Container fluid style={{ marginTop: "2em" }}>
       <Row>
       <Col>
      <Card>
      <CardHeader>
      <h2>새 게시글 작성</h2>
      </CardHeader>
      <CardBody style={{ maxHeight: "40em", overflowY: "auto" }}>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label htmlFor="post_targetnum">대상 번호:</label>
          <select
            className="form-control"
            id="post_targetnum"
            name="post_targetnum"
            value={formData.post_targetnum} // 상태 값으로 연결
            onChange={handleChange}
            required
          >
            <option value="">대상 번호를 선택하세요</option>
            <option value="1">1:경영진</option>
            <option value="2">2:인사팀</option>
            <option value="3">3:재무팀</option>
          </select>
        </div>
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
            value={formData.post_fk_user_num}
            onChange={handleChange}
            required
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
        <button onClick={handleSubmit} type="submit" className="btn btn-primary">
          게시글 저장
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleBackToList} // 목록으로 돌아가기 버튼 클릭 시
        >
          목록
        </button>
      </form>
      </CardBody>
      </Card>
      </Col>
      </Row>
      </Container>
  );
};

export default FreeCreate;