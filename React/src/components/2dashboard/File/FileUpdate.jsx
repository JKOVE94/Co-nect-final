import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { toast, ToastContainer } from "react-toastify"; // Toastify import
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS

const FileUpdate = () => {
  const { filePkNum } = useParams(); // URL에서 파일 ID 추출
  const navigate = useNavigate();
  const [file, setFile] = useState({
    wiki_title: "",
    wiki_content: "",
    wiki_isnotice: false, // 중요 여부 추가
    file_name: "",
  });
  const [newFile, setNewFile] = useState(null); // 새 파일 저장용 상태

  useEffect(() => {
    // 기존 데이터를 가져오는 함수
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/file/${filePkNum}`);
        console.log("Fetched file data:", response.data); // 데이터 확인
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
    const file = e.target.files[0];
    setNewFile(file); // 새 파일 설정
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("wiki_title", file.wiki_title);
      formData.append("wiki_content", file.wiki_content);
      formData.append("wiki_isnotice", file.wiki_isnotice); // 중요 여부 추가
      if (newFile) {
        formData.append("file", newFile); // 새 파일이 있는 경우 추가
      }

      const response = await axios.put(`/file/${filePkNum}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("수정이 완료되었습니다!");
        setTimeout(() => navigate(`/main/file/detail/${filePkNum}`), 2000); // 수정 후 상세보기 페이지로 이동
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
      {/* Toast Container */}
      <ToastContainer
        position="bottom-center" // 화면 하단 중앙에 토스트 표시
        autoClose={3000} // 자동 닫힘 시간 설정
        hideProgressBar // 진행 표시줄 숨김
        closeOnClick
        pauseOnHover
        draggable
      />
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
            <div
              style={{
                marginTop: "2em",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "1em",
              }}
            >
              <label
                htmlFor="wiki_isnotice"
                style={{ margin: "0", fontWeight: "bold" }}
              >
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
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
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

export default FileUpdate;
