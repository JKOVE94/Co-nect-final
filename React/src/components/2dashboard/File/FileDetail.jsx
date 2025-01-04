import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify"; // Toastify import
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS
import axiosInstance from "../../../api/axiosInstance";

const FileDetail = () => {
  const filePkNumInt = parseInt(useParams().filePkNum, 10);
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const compNum = userInfo.user_fk_comp_num; //회사번호
  const projNum = sessionStorage.getItem("persist:proj_pk_num");

  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 정보

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axiosInstance.get(
          `/conect/${compNum}/file/${projNum}/${filePkNumInt}`
        );
        setPost(response.data);
      } catch (err) {
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    // console.log(post);
  }, [filePkNumInt]);

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const toggleDownloadModal = () => {
    setSelectedFile({ filePkNumInt: filePkNumInt, fileName: post.file_name });
    setIsDownloadModalOpen(!isDownloadModalOpen);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(
        `/conect/${compNum}/file/${projNum}/${filePkNumInt}`
      );
      toggleDeleteModal();
      toast.success("파일이 성공적으로 삭제되었습니다.");
      setTimeout(() => navigate("/main/file"), 2000); // 삭제 후 목록으로 이동
    } catch (err) {
      toggleDeleteModal();
      toast.error(
        "삭제 실패: " + (err.response ? err.response.data : err.message)
      );
    }
  };

  const handleDownload = async () => {
    const { filePkNumInt, fileName } = selectedFile;
    try {
      const response = await axiosInstance.get(
        `/conect/${compNum}/file/${projNum}/download/${filePkNumInt}`,
        {
          responseType: "blob",
        }
      );

      // 브라우저에서 다운로드 처리
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", decodeURIComponent(fileName)); // 파일 이름 설정
      document.body.appendChild(link);
      link.click();
      link.remove();
      toggleDownloadModal(); // 모달 닫기
    } catch (err) {
      toast.error("파일 다운로드 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      {/* Toast Container */}
      <ToastContainer
        position="bottom-center" // 화면 하단 중앙에 표시
        autoClose={3000} // 3초 후 자동 닫힘
        hideProgressBar // 진행 표시줄 숨김
        closeOnClick
        pauseOnHover
        draggable
      />
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
                <i
                  className="fas fa-heading"
                  style={{ marginRight: "0.5em" }}
                ></i>
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
                  <i
                    className="fas fa-user"
                    style={{ marginRight: "0.5em" }}
                  ></i>
                  작성자
                </h5>
                <p
                  style={{
                    margin: "0",
                    padding: "0.5em 0",
                    fontSize: "1.1rem",
                  }}
                >
                  {post.wiki.user_name || "작성자 없음"}
                </p>
              </div>
              <div style={{ flex: "1", textAlign: "left" }}>
                <h5 style={{ fontWeight: "bold", color: "#343a40" }}>
                  <i
                    className="fas fa-calendar-alt"
                    style={{ marginRight: "0.5em" }}
                  ></i>
                  작성일
                </h5>
                <p
                  style={{
                    margin: "0",
                    padding: "0.5em 0",
                    fontSize: "1.1rem",
                  }}
                >
                  {post.wiki?.wiki_regdate || "알 수 없음"}
                </p>
              </div>
              <div style={{ flex: "1", textAlign: "left" }}>
                <h5 style={{ fontWeight: "bold", color: "#343a40" }}>
                  <i
                    className="fas fa-eye"
                    style={{ marginRight: "0.5em" }}
                  ></i>
                  조회수
                </h5>
                <p
                  style={{
                    margin: "0",
                    padding: "0.5em 0",
                    fontSize: "1.1rem",
                  }}
                >
                  {post.wiki?.wiki_view || 0}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5em",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1em",
                    }}
                  >
                    <p style={{ margin: "0", fontSize: "1.1rem" }}>
                      {post.file_name}
                    </p>
                    <Button
                      color="success"
                      onClick={toggleDownloadModal}
                      style={{ fontSize: "1rem" }}
                    >
                      다운로드
                    </Button>
                  </div>
                  <div style={{ display: "flex", gap: "2em" }}>
                    <p style={{ margin: "0", fontSize: "1.1rem" }}>
                      <strong>크기:</strong>{" "}
                      {post.file_size
                        ? (post.file_size / (1024 * 1024)).toFixed(2) + " MB"
                        : "알 수 없음"}
                    </p>
                    <p style={{ margin: "0", fontSize: "1.1rem" }}>
                      파일 유형: {post.file_type || "알 수 없음"}
                    </p>
                  </div>
                </div>
              ) : (
                <p
                  style={{
                    margin: "0",
                    padding: "0.5em 0",
                    fontSize: "1.1rem",
                  }}
                >
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
                <i
                  className="fas fa-align-left"
                  style={{ marginRight: "0.5em" }}
                ></i>
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

          <div
            style={{
              marginTop: "2em",
              display: "flex",
              justifyContent: "flex-end",
              gap: "1em",
            }}
          >
            {userInfo.user_pk_num == post.wiki.wiki_fk_user_num ? (
              <Button
                color="primary"
                onClick={() => navigate(`/main/file/update/${filePkNumInt}`)}
              >
                수정
              </Button>
            ) : null}
            {userInfo.user_pk_num == post.wiki.wiki_fk_user_num ? (
              <Button color="danger" onClick={toggleDeleteModal}>
                삭제
              </Button>
            ) : null}
            <Button color="secondary" onClick={() => navigate("/main/file")}>
              목록
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
        backdrop="static"
      >
        <ModalHeader toggle={toggleDeleteModal}>삭제 확인</ModalHeader>
        <ModalBody>정말로 이 파일을 삭제하시겠습니까?</ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={() => {
              handleDelete();
            }}
          >
            삭제
          </Button>
          <Button color="secondary" onClick={toggleDeleteModal}>
            취소
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={isDownloadModalOpen}
        toggle={toggleDownloadModal}
        backdrop="static"
      >
        <ModalHeader toggle={toggleDownloadModal}>파일 다운로드</ModalHeader>
        <ModalBody>
          {selectedFile?.fileName
            ? `"${selectedFile.fileName}" 파일을 다운로드 하시겠습니까?`
            : "파일이 선택되지 않았습니다."}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleDownload}>
            다운로드
          </Button>
          <Button color="secondary" onClick={toggleDownloadModal}>
            취소
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default FileDetail;
