import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";

const FileUpdate = () => {
  const { filePkNum } = useParams(); // URL에서 파일 ID 추출
  const navigate = useNavigate();
  const [file, setFile] = useState({
    wiki_title: "",
    wiki_content: "",
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
          wiki_title: response.data.wiki.wiki_title || "", // wikiTitle에서 제목 가져오기
          wiki_content: response.data.wiki.wiki_content || "", // wikiContent에서 내용 가져오기
          file_name: response.data.file_name || "", // 기존 파일 이름 가져오기
        });
      } catch (error) {
        console.error("Error fetching file:", error);
        alert("데이터를 불러오는데 실패했습니다.");
      }
    };

    fetchPost();
  }, [filePkNum]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFile({ ...file, [name]: value });
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
      if (newFile) {
        formData.append("file", newFile); // 새 파일이 있는 경우 추가
      }

      const response = await axios.put(`/file/${filePkNum}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        alert("수정이 완료되었습니다.");
        navigate(`/main/file/detail/${filePkNum}`); // 수정 후 상세보기 페이지로 이동
      }
    } catch (error) {
      console.error("Error updating file:", error);
      alert("수정 중 문제가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(`/main/file/detail/${filePkNum}`);
  };

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <Card>
        <CardHeader>
          <h2>게시글 수정</h2>
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
            <div style={{ marginTop: "1.5em" }}>
              <button type="submit" className="btn btn-primary" style={{ marginRight: "1em" }}>
                수정
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                취소
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FileUpdate;
