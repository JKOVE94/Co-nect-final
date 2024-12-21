import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const FileDetail = () => {
  const filePkNumInt = parseInt(useParams().filePkNum, 10);
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/file/${filePkNumInt}`);
        setPost(response.data);
      } catch (err) {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [filePkNumInt]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // 모달 열기/닫기
  };

  const handleDelete = async () => {
    console.log("handleDelete 호출됨, 삭제 대상 ID:", filePkNumInt);
    try {
      await axios.delete(`/file/${filePkNumInt}`);
      console.log("삭제 성공");
      navigate("/main/file", { state: { success: true } });
    } catch (err) {
      console.error("삭제 실패:", err.response ? err.response.data : err.message);
      setError("삭제 실패: " + (err.response ? err.response.data : err.message));
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get(`/file/download/${filePkNumInt}`, {
        responseType: "blob",
      });

      // 브라우저에서 파일 다운로드
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", post.file_name); // 파일 이름 설정
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("파일 다운로드 실패:", err);
      alert("파일 다운로드 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <Card>
        <CardHeader>
          <h2>파일 보기</h2>
        </CardHeader>
        <CardBody style={{ fontSize: "1.2rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5em",
            }}
          >
            {/* 제목 */}
            <div>
              <h5 style={{ fontWeight: "bold" }}>
                <i className="fas fa-heading" style={{ marginRight: "0.5em" }}></i>
                제목
              </h5>
              <p
                style={{
                  margin: "0",
                  padding: "0.5em 0",
                  fontSize: "1.5rem",
                  color: "#343a40",
                  fontWeight: "bold",
                }}
              >
                {post.wiki?.wiki_title || "제목 없음"}
              </p>
            </div>

            {/* 작성자와 작성일 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: "1", textAlign: "left" }}>
                <h5 style={{ fontWeight: "bold", color: "#343a40" }}>
                  <i className="fas fa-user" style={{ marginRight: "0.5em" }}></i>
                  작성자
                </h5>
                <p style={{ margin: "0", padding: "0.5em 0", fontSize: "1.1rem" }}>
                  {post.user_name || "작성자 없음"}
                </p>
              </div>
              <div style={{ flex: "1", textAlign: "left" }}>
                <h5 style={{ fontWeight: "bold", color: "#343a40" }}>
                  <i className="fas fa-calendar-alt" style={{ marginRight: "0.5em" }}></i>
                  작성일
                </h5>
                <p style={{ margin: "0", padding: "0.5em 0", fontSize: "1.1rem" }}>
                  {post.wiki?.wiki_regdate || "알 수 없음"}
                </p>
              </div>
            </div>

            {/* 파일 */}
            <div>
              <h5 style={{ fontWeight: "bold", color: "#343a40" }}>
                <i className="fas fa-file" style={{ marginRight: "0.5em" }}></i>
                파일
              </h5>
              {post.file_name ? (
                <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
                  <p style={{ margin: "0", fontSize: "1.1rem" }}>{post.file_name}</p>
                  <Button
                    color="success"
                    onClick={handleDownload}
                    style={{ fontSize: "1rem" }}
                  >
                    다운로드
                  </Button>
                </div>
              ) : (
                <p style={{ margin: "0", padding: "0.5em 0", fontSize: "1.1rem" }}>
                  파일 없음
                </p>
              )}
            </div>

            {/* 내용 */}
            <div>
              <h5
                style={{
                  fontWeight: "bold",
                  color: "#343a40",
                  marginBottom: "0.5em",
                }}
              >
                <i className="fas fa-align-left" style={{ marginRight: "0.5em" }}></i>
                내용
              </h5>
              <div
                style={{
                  border: "1px solid #dee2e6",
                  padding: "1em",
                  borderRadius: "5px",
                  backgroundColor: "#f8f9fa",
                  fontSize: "1.3rem",
                  lineHeight: "1.8",
                }}
              >
                {post.wiki?.wiki_content || "내용 없음"}
              </div>
            </div>
          </div>

          <div style={{ marginTop: "2em", display: "flex", justifyContent: "flex-end", gap: "1em" }}>
            <Button
              color="primary"
              onClick={() => navigate(`/main/file/update/${filePkNumInt}`)}
            >
              수정
            </Button>
            <Button color="danger" onClick={toggleModal}>
              삭제
            </Button>
            <Button color="secondary" onClick={() => navigate("/main/file")}>
              목록
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 삭제 확인 모달 */}
      <Modal isOpen={isModalOpen} toggle={toggleModal} backdrop="static">
        <ModalHeader toggle={toggleModal}>삭제 확인</ModalHeader>
        <ModalBody>정말로 이 파일을 삭제하시겠습니까?</ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={() => {
              handleDelete();
              toggleModal();
            }}
          >
            삭제
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            취소
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default FileDetail;
