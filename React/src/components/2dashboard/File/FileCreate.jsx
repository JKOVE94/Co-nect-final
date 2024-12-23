import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify"; // Import Toast components
import "react-toastify/dist/ReactToastify.css"; // Import Toast CSS

const FileCreate = () => {
  const writer = useSelector((state) => state.userData);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    wiki_title: "",
    wiki_content: "",
    wiki_fk_user_num: writer?.userNum || 1,
    wiki_fk_proj_num: 1,
    wiki_isnotice: false,
    file: null,
    file_name: "",
    file_size: 0,
    file_type: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxFileSize = 10 * 1024 * 1024; // 10MB 제한
    if (file.size > maxFileSize) {
      toast.error("파일 크기는 10MB를 초과할 수 없습니다."); // Error toast
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
    data.append("wiki_fk_proj_num", formData.wiki_fk_proj_num);
    data.append("wiki_isnotice", formData.wiki_isnotice);

    try {
      const response = await axios.post("/file", data);

      console.log("서버 응답:", response.data);
      if (response.data != null) {
        toast.success("파일이 성공적으로 업로드되었습니다!"); // Success toast
        setTimeout(() => navigate(`/main/file/detail/${response.data}`), 1000); // Redirect after 3 seconds
      } else {
        throw new Error("저장된 파일 ID가 반환되지 않았습니다.");
      }
    } catch (error) {
      console.error("파일 업로드 중 오류:", error);
      const status = error.response?.status;
      toast.error(
        `저장 중 오류가 발생했습니다.${
          status ? `\n오류 코드: ${status}` : "\n서버에 연결할 수 없습니다."
        }`
      ); // Error toast
    }
  };

  const handleBackToList = () => {
    navigate("/main/file");
  };

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <ToastContainer /> {/* Toast container */}
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
              <label htmlFor="file">파일 첨부:</label> <br />
              파일은 10MB 이하만 등록 가능합니다.
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
                  <br />
                  <strong>크기:</strong>{" "}
                  {(formData.file_size / (1024 * 1024)).toFixed(2)} MB
                  <br />
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
            <div className="form-group" style={{ marginTop: "1.5em" }}>
              <label htmlFor="wiki_isnotice">
                <input
                  type="checkbox"
                  id="wiki_isnotice"
                  name="wiki_isnotice"
                  checked={formData.wiki_isnotice}
                  onChange={handleChange}
                />{" "}
                공지로 설정
              </label>
            </div>
            <div style={{ marginTop: "1.5em", textAlign: "right" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  !formData.file || !formData.wiki_title || !formData.wiki_content
                }
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
