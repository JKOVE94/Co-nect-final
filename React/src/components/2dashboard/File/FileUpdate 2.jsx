import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FileUpdate = () => {
  const { filePkNum } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState({
    wiki_title: "",
    wiki_content: "",
    wiki_isnotice: false,
    file_name: "",
  });
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/file/${filePkNum}`);
        setFile({
          wiki_title: response.data.wiki.wiki_title || "",
          wiki_content: response.data.wiki.wiki_content || "",
          wiki_isnotice: response.data.wiki.wiki_isnotice || false,
          file_name: response.data.file_name || "",
        });
      } catch (error) {
        console.error("Error fetching file:", error);
        toast.error("데이터를 불러오는데 실패했습니다.");
      }
    };

    fetchPost();
  }, [filePkNum]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFile({ ...file, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    setNewFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("wiki_title", file.wiki_title);
      formData.append("wiki_content", file.wiki_content);
      formData.append("wiki_isnotice", file.wiki_isnotice);
      if (newFile) {
        formData.append("file", newFile);
      }

      const response = await axios.put(`/file/${filePkNum}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("수정이 완료되었습니다!");
        setTimeout(() => navigate(`/main/file/detail/${filePkNum}`), 2000);
      }
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error("수정 중 문제가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(`/main/file/detail/${filePkNum}`);
  };

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
      <Card>
        <CardHeader>
          <h2>파일 수정</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="wiki_title">제목:</label>
              <input
                type="text"
                className="form-control"
                id="wiki_title"
                name="wiki_title"
                value={file.wiki_title}
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
                value={file.wiki_content}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="file_path">파일:</label>
              {file.file_name && (
                <p>
                  <strong>현재 파일:</strong> {file.file_name}
                </p>
              )}
              <input
                type="file"
                className="form-control"
                id="file_path"
                name="file"
                onChange={handleFileChange}
              />
            </div>
            <div style={{ marginTop: "2em", display: "flex", justifyContent: "flex-end", gap: "1em" }}>
              <label htmlFor="wiki_isnotice" style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  id="wiki_isnotice"
                  name="wiki_isnotice"
                  checked={file.wiki_isnotice}
                  onChange={handleChange}
                  style={{ marginRight: "0.5em" }}
                />
                중요 파일
              </label>
              <button type="submit" className="btn btn-primary">
                수정
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                목록
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FileUpdate;
