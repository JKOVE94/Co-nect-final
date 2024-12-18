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
    wiki_title: "", // 제목을 추가
    wiki_content: "",
    wiki_fk_user_num: writer.userNum || 1,  // 유저 번호, Redux에서 가져온 유저 정보로 설정
    wiki_regdate: new Date().toISOString(),  // 현재 시간
    wiki_view: 0,
    wiki_boardtype: 2,
    file_name: "",
    file_fk_wiki_num: null,  // file_fk_wiki_num은 null로 설정 가능
    file_path: "",
    file_size: 0,
    file_type: "",
    file: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

    // 기본값 처리
    const formToSubmit = {
      ...formData,
      wiki_fk_user_num: formData.wiki_fk_user_num || "1",  // 값이 없으면 "1"로 설정
      wiki_regdate: new Date().toISOString(),  // 현재 시간 추가
      wiki_boardtype: formData.wiki_boardtype,
      file_fk_wiki_num: formData.file_fk_wiki_num || null, // file_fk_wiki_num이 null일 수 있음

    };

    console.log('Form data before submitting:', formToSubmit);

    const form = new FormData();
    form.append('file', formData.file);
    form.append('file_name', formData.file_name);
    form.append('file_fk_wiki_num', formData.file_fk_wiki_num); // file_fk_wiki_num은 null로 설정될 수 있음
    form.append('wiki_fk_user_num', formToSubmit.wiki_fk_user_num);
    form.append('wiki_content', formToSubmit.wiki_content);
    form.append('wiki_regdate', formToSubmit.wiki_regdate);
    form.append('wiki_boardtype', formToSubmit.wiki_boardtype);
    
    axios
      .post("/file/", form)  // 업로드 URL은 "/file/"으로 설정
      .then((response) => {
        if (response.data && response.data.fileUrl) {
          setFormData((prevData) => ({
            ...prevData,
            file_path: response.data.fileUrl, // GCS에서 반환된 파일 URL
            file_fk_wiki_num: response.data.filePkNum || null, // 서버에서 반환된 filePkNum을 file_fk_wiki_num에 설정, 없으면 null
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
              <label htmlFor="file_path">파일 첨부:</label>
              <input
                type="file"
                className="form-control"
                id="file_path"
                name="file_path"
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

export default FileCreate;
