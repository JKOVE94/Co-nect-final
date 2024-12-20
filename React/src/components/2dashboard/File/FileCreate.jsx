import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";

const FileCreate = () => {
  const writer = useSelector((state) => state.userData);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    wiki_title: "",
    wiki_content: "",
    wiki_fk_user_num: writer?.userNum || 1,
    wiki_boardtype: 2,
    file: null,
    file_name: "",
    file_size: 0,
    file_type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxFileSize = 10 * 1024 * 1024;
    if (file.size > maxFileSize) {
      alert("파일 크기는 10MB를 초과할 수 없습니다.");
      return;
    }

    setFormData({
      ...formData,
      file,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("file", formData.file);
    data.append("wiki_title", formData.wiki_title);
    data.append("wiki_content", formData.wiki_content);
    data.append("wiki_fk_user_num", formData.wiki_fk_user_num);
    data.append("wiki_fk_proj_num", 1);
    data.append("wiki_isnotice", false);
    // data.append("wiki_boardtype", formData.wiki_boardtype);

    axios
      .post("/file", data)
      .then((response) => {
        alert("파일이 성공적으로 업로드되었습니다.");
        navigate(`/main/file/detail/${response.data.filePkNum || ''}`);
      })
      .catch((error) => {
        console.error("파일 업로드 중 오류:", error);
        alert("저장 중 오류가 발생했습니다. 오류 코드: " + error.response?.status);
      });
  };

  const handleBackToList = () => {
    navigate('/main/file');
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
              {formData.file && (
                <div style={{ marginTop: "1em" }}>
                  <strong>선택한 파일:</strong> {formData.file_name}
                  {formData.file_type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(formData.file)}
                      alt="미리보기"
                      style={{ maxWidth: "100%", height: "auto", marginTop: "1em" }}
                    />
                  )}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!formData.file || !formData.wiki_title || !formData.wiki_content}
            >
              게시글 저장
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleBackToList}>
              목록
            </button>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FileCreate;
