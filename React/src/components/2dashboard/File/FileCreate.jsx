import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";

const FileCreate = () => {
  // Redux에서 로그인한 유저 정보 가져오기
  const writer = useSelector((state) => state.userData); 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    file_name: "",
    file_fk_wiki_num: 0,
    file_path: "",
    file_size: 0,
    file_type: "",
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
      post_fk_user_num: formData.post_fk_user_num || "1",  // 값이 없으면 "1"로 설정
      regdate: new Date().toISOString(),  // 현재 시간 추가
    };

    console.log('Form data before submitting:', formToSubmit);
    
    axios
      .post("/file/", formToSubmit)
      .then((response) => {
        if (response.data !== 0) {
          navigate(`/main/file/detail/${response.data}`);
        }
      })
      .catch((error) => {
        console.error("게시글 저장 중 오류:", error);
        alert("저장 중 오류가 발생했습니다. 오류 코드: " + error.response.status);
      });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // 사용자가 선택한 파일
    setFormData({ ...formData, file }); // 상태에 파일 추가
  };

  const handleBackToList = () => {
    navigate('/main/file'); // React Router로 리디렉션
  };

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <Card>
        <CardHeader>
          <h2>새 파일 등록</h2>
        </CardHeader>
        <CardBody style={{ maxHeight: "40em", overflowY: "auto" }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="file_post_name">제목:</label>
              <input
                type="text"
                className="form-control"
                id="file_post_name"
                name="file_post_name"
                value={formData.file_post_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="file">파일 첨부:</label>
              <input
                type="file"
                className="form-control"
                id="file"
                name="file"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="file_content">내용:</label>
              <textarea
                className="form-control"
                id="file_content"
                name="file_content"
                value={formData.file_content}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="file_size">파일 크기:</label>
              <input
                type="number"
                className="form-control"
                id="file_size"
                name="file_size"
                value={formData.file_size}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="file_type">파일 타입:</label>
              <input
                type="text"
                className="form-control"
                id="file_type"
                name="file_type"
                value={formData.file_type}
                readOnly
              />
            </div>
            <button type="submit" className="btn btn-primary">게시글 저장</button>
            <button type="button" className="btn btn-secondary" onClick={handleBackToList}>목록</button>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FileCreate;