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
    wiki_title: "", 
    wiki_content: "",
    wiki_fk_user_num: writer.userNum || 1,  // 유저 번호, Redux에서 가져온 유저 정보로 설정
    wiki_regdate: new Date().toISOString(),  // 현재 시간
    wiki_view: 0,
    wiki_boardtype: 2,
    file_name: "",
    file_fk_wiki_num: null,  // file_fk_wiki_num은 null로 설정 가능
    file_path: "", // 파일 경로를 서버에서 받게 되므로 기본값은 빈 문자열
    file_size: 0,
    file_type: "",
    file: null,  // 실제 파일 데이터
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if(name === "file_path") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }))
    }

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // 사용자가 선택한 파일
    setFormData({
      ...formData,
      file, // 상태에 파일 추가
      file_name: file.name, // 파일 이름 자동 설정
      file_size: file.size, // 파일 크기 자동 설정
      file_type: file.type, // 파일 타입 자동 설정
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    
    // formData의 모든 값을 FormData 객체에 추가
    for (const key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    // axios를 통해 파일과 함께 데이터를 전송
    axios
      .post("/file", data, { // 업로드 URL은 "/file/"으로 설정
        headers: {
          "Content-Type": "multipart/form-data", // 파일 업로드 시 multipart/form-data 설정
        }
      })  
      .then((response) => {
        if (response.data && response.data.fileUrl) {
          setFormData((prevData) => ({
            ...prevData,
            file_path: response.data.fileUrl, // GCS에서 반환된 파일 URL
          }));
          navigate(`/main/file/detail/${response.data.filePkNum || ''}`); // 파일 저장 후 상세 페이지로 이동
        }
      })
      .catch((error) => {
        console.error("파일 업로드 중 오류:", error);
        alert("저장 중 오류가 발생했습니다. 오류 코드: " + error.response.status);
      });
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
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="wiki_title">제목:</label>
              <input
                type="text"
                className="form-control"
                id="wiki_title"
                name="wiki_title"
                value={formData.wiki_title}
                onChange={handleChange}
                required
              />
            </div>           
            <div className="form-group">
              <label htmlFor="wiki_content">내용:</label>
              <textarea
                className="form-control"
                id="wiki_content"
                name="wiki_content"
                value={formData.wiki_content}
                onChange={handleChange}
                required
              ></textarea>
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
}

export default FileCreate;
