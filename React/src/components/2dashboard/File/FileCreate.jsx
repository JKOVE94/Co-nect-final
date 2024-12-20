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

    const maxFileSize = 10 * 1024 * 1024; // 10MB 제한
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("file", formData.file);
    data.append("wiki_title", formData.wiki_title);
    data.append("wiki_content", formData.wiki_content);
    data.append("wiki_fk_user_num", formData.wiki_fk_user_num);
    data.append("wiki_fk_proj_num", 1);
    data.append("wiki_isnotice", false);
    //vdata.append("wiki_boardtype", formData.wiki_boardtype);

    try {
      const response = await axios.post("/file", data);

      console.log("서버 응답:", response.data); // 서버 응답 확인
      if (response.data != null) {
        alert("파일이 성공적으로 업로드되었습니다.");
        navigate(`/main/file/detail/${response.data}`);
      } else {
        throw new Error("저장된 파일 ID가 반환되지 않았습니다.");
      }
    } catch (error) {
      console.error("파일 업로드 중 오류:", error);
      const status = error.response?.status;
      alert(
        `저장 중 오류가 발생했습니다.\n${
          status ? `오류 코드: ${status}` : "서버에 연결할 수 없습니다."
        }`
      );
    }
  };

  const handleBackToList = () => {
    navigate("/main/file");
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
                      style={{
                        maxWidth: "300px",
                        height: "auto",
                        marginTop: "1em",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                  )}
                </div>
              )}
            </div>
            <div style={{ marginTop: "1.5em" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!formData.file || !formData.wiki_title || !formData.wiki_content}
                style={{ marginRight: "1em" }}
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
            </div>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FileCreate;
