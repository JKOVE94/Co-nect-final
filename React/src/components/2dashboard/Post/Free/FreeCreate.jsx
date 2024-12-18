import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";

const FreeCreate = () => {
  // Redux에서 로그인한 유저 정보 가져오기 (로그인된 사용자의 정보)
  const writer = useSelector((state) => state.userData); 
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  // 폼 데이터 초기화
  const [formData, setFormData] = useState({
    post_targetnum: "", // 게시글 대상 사원번호
    post_name: "", // 게시글 제목
    post_fk_user_num: writer.user_pk_num || "1", // 로그인한 유저의 pk_num을 기본값으로 설정
    post_fk_comp_num: writer.user_fk_comp_num || "1", // 회사 번호도 Redux에서 가져온 값으로 설정
    post_import: "", // 게시글 중요도
    post_content: "", // 게시글 내용
  });

  // 폼 데이터 변경 처리
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value, // 각 입력 필드의 값 업데이트
    });
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지

    // 폼 제출을 위한 데이터 처리 (기본값 설정)
    const formToSubmit = {
      ...formData,
      post_fk_user_num: formData.post_fk_user_num || "1",  // 값이 없으면 "1"로 설정
      post_fk_comp_num: formData.post_fk_comp_num || "1",  // 값이 없으면 "1"로 설정
      regdate: new Date().toISOString(),  // 현재 시간 추가
      post_kind: "1",    // 기본값
      post_fk_dpart_num: "1", // 기본값
      post_tag: "red",   // 기본값
    };

    // 제출 데이터 확인용 로그
    console.log('Form data before submitting:', formToSubmit);
    
    // axios를 사용하여 서버로 POST 요청 (게시글 생성)
    axios
      .post("/board/free", formToSubmit)
      .then((response) => {
        if (response.data !== 0) {
          // 게시글 작성 후 상세 페이지로 리디렉션
          navigate(`/main/free/detail/${response.data}`, {
            state: { actionType: "create" }, // 게시글 생성 상태 정보 전달
          });
        }
      })
      .catch((error) => {
        console.error("게시글 저장 중 오류:", error);
        alert("저장 중 오류가 발생했습니다. 오류 코드: " + error.response.status);
      });
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    navigate('/main/free'); // 게시글 목록 페이지로 이동
  };

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <Card>
        <CardHeader>
          <h2>새 게시글 작성</h2> {/* 카드 헤더 - 게시글 작성 */}
        </CardHeader>
        <CardBody style={{ maxHeight: "40em", overflowY: "auto" }}>
          <form onSubmit={handleSubmit}> {/* 폼 제출 시 handleSubmit 호출 */}
            <div className="form-group">
              <label htmlFor="post_name">제목:</label>
              <input
                type="text"
                className="form-control"
                id="post_name"
                name="post_name"
                value={formData.post_name}
                onChange={handleChange} // 입력값 변경 시 handleChange 호출
                required // 필수 입력 사항
              />
            </div>
            <div className="form-group">
              <label htmlFor="post_fk_user_num">작성자:</label>
              <input
                type="text"
                className="form-control"
                id="post_fk_user_num"
                name="post_fk_user_num"
                value={writer.user_name} // 로그인된 유저 이름
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
                onChange={handleChange} // 중요도 선택 시 handleChange 호출
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
                onChange={handleChange} // 내용 입력 시 handleChange 호출
                required
              ></textarea>
            </div>
            <button onClick={handleSubmit} type="submit" className="btn btn-primary">게시글 저장</button>
            <button type="button" className="btn btn-secondary" onClick={handleBackToList}>목록</button>
            <button type="button" className="btn btn-secondary">임시저장</button> {/* 임시저장 기능 미구현 */}
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FreeCreate;