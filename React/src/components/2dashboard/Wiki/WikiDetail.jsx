import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";
import WikiToast from "variables/Toast/WikiToast";
import { Button, Modal, ModalBody, ModalFooter } from "react-bootstrap";

const WikiDetail = () => {
  // 현재 URL의 state를 확인하기 위해 useLocation 사용
  const location = useLocation();

  // 상태 값 정의 (type: 게시글 상태 관리, post: 게시글 데이터 저장)
  const [type, setType] = useState(0); // 0: 기본값, "create": 등록, "update": 수정
  const { wikiPkNum } = useParams();
  const navigate = useNavigate();
  const [wiki, setWiki] = useState({}); // 게시글 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const loginUser = useSelector((state) => state.userData);
  const [showConfirmModal, setShowConfirmModal] = useState(false); // 목록 이동 확인 모달 상태

  // 토스트 알림 상태 및 토글 함수
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => {
    setShowA(true); // 토스트 표시
    setTimeout(() => {
      setShowA(false); // 3초 후 토스트 숨기기
    }, 3000);
  };

  // 화면 로드 시 실행되는 useEffect
  useEffect(() => {
    // URL state에서 actionType 확인 (등록/수정 여부)
    const actionType = location.state?.actionType;
    if (actionType === "create") {
      setType("create"); // 등록 상태
      toggleShowA(); // 토스트 표시
    } else if (actionType === "update") {
      setType("update"); // 수정 상태
      toggleShowA(); // 토스트 표시
    }

    // 게시글 데이터 fetch 함수 정의
    const fetchWiki = async () => {
      try {
        const response = await axios.get(`/wiki/wikidetail/${wikiPkNum}`);
        setWiki(response.data); // 성공 시 게시글 데이터 저장
        console.log(response.data); // wiki 객체 구조 확인
      } catch (err) {
        setError(err.message); // 에러 발생 시 에러 메시지 설정
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };
    fetchWiki(); // 게시글 데이터 요청 함수 호출
  }, [wikiPkNum, location.state]);

  const handleFileDownload = async (filePath, fileName) => {
    try {
      const response = await axios.get(filePath, {
        responseType: "blob", // 바이너리 데이터로 파일 다운로드
      });

      // 브라우저에서 파일 다운로드
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // 파일 이름 설정
      document.body.appendChild(link);
      link.click(); // 클릭 이벤트 트리거로 다운로드 실행
      link.parentNode.removeChild(link); // 다운로드 후 링크 제거
    } catch (error) {
      console.error("파일 다운로드 실패:", error);
    }
  };

  // 삭제 버튼 클릭 시 모달 표시
  const handleListClick = () => {
    setShowConfirmModal(true); // 목록 이동 확인 모달 열기
  };

  // 모달에서 확인 버튼 클릭 시 목록으로 이동
  const handleConfirmList = () => {
    setShowConfirmModal(false); // 모달 닫기
    navigate("/main/wiki/wikilist", { state: { success: true } }); // 목록 페이지로 이동
  };

  // 모달에서 취소 버튼 클릭 시 모달 닫기
  const handleCancelList = () => {
    setShowConfirmModal(false);
  };

  // 로딩 중일 때 표시
  if (loading) return <div>Loading...</div>;
  // 에러 발생 시 표시
  if (error) return <div>Error: {error}</div>;

  return (
    <Container fluid style={{ Height: "40em", marginTop: "2em" }}>
      <Card style={{ Height: "40em", overflowY: "auto", zIndex: 100 }}>
        <CardHeader>
          <h2>문서 상세보기</h2> {/* 카드 제목 */}
        </CardHeader>
        <CardBody
          style={{
            maxHeight: "40em",
            overflowY: "auto",
            fontSize: "1.2rem",
            marginTop: "1em",
          }}
        >
          <div>
            {/* 게시글 정보 표시 */}
            {wiki ? (
              <table
                className="table"
                style={{
                  fontSize: "1.2rem",
                  border: "1px solid lightgray",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>제 목</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {/* wiki_is_notice가 1일 경우 제목 앞에 🔔 표시 */}
                      {wiki.wiki_isnotice === true && (
                        <span role="img" aria-label="bell">
                          🔔&nbsp;
                        </span>
                      )}
                      <span
                        style={{
                          fontWeight:
                            wiki.wiki_isnotice === true ? "bold" : "normal", // 공지일 경우 글자를 굵게
                        }}
                      >
                        {wiki.wiki_title} {/* 게시글 제목 */}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>
                      작 성 자
                    </td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {wiki.user_name} {/* 작성자 */}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>
                      등 록 일
                    </td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {new Date(wiki.wiki_regdate).toISOString().split("T")[0]}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>파 일</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {wiki.file_name && wiki.file_path ? (
                        <span>
                          <a href={wiki.file_path}>{wiki.file_name}</a>&nbsp;
                          <button
                            onClick={() =>
                              handleFileDownload(wiki.file_path, wiki.file_name)
                            }
                            style={{
                              background: "none",
                              border: "none",
                              padding: "0",
                              fontSize: "1.5em",
                              cursor: "pointer",
                            }}
                            aria-label={`Download ${wiki.file_name}`}
                          >
                            ⬇️
                          </button>
                        </span>
                      ) : (
                        <span>첨부된 파일이 없습니다.</span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}> 내 용</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {wiki.wiki_content} {/* 게시글 내용 */}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div>게시글을 찾을 수 없습니다.</div>
            )}
            <br />

            {/* 버튼 섹션 */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/main/wiki/wikiedit/${wikiPkNum}`)}
              >
                수정 {/* 수정 버튼 */}
              </button>
              <Button variant="danger" block onClick={handleListClick}>
                삭제
              </Button>

              <Modal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                style={{
                  maxWidth: "500px",
                  margin: "auto", // 자동으로 중앙 정렬
                  top: "35%", // Modal을 화면 중앙에서 적당히 아래로 위치
                }}
              >
                <ModalBody style={{ textAlign: "center" }}>
                  정말 삭제하시겠습니까?
                </ModalBody>
                <ModalFooter style={{ justifyContent: "center" }}>
                  <Button variant="primary" onClick={handleConfirmList}>
                    확인
                  </Button>
                  <Button variant="danger" onClick={handleCancelList}>
                    취소
                  </Button>
                </ModalFooter>
              </Modal>
              <Button
                style={{
                  backgroundColor: "#696969",
                  borderColor: "#696969",
                  color: "white",
                }}
                block
                onClick={() => navigate("/main/wiki/wikilist")}
              >
                목록
              </Button>
            </div>
          </div>
          <br />
        </CardBody>
      </Card>
      {/* 토스트 컴포넌트 */}
      <WikiToast type={type} showA={showA} toggleShowA={toggleShowA} />
    </Container>
  );
};

export default WikiDetail;
