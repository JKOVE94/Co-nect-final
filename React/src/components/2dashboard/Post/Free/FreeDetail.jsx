import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import PostToast from "variables/Toast/PostToast";

const FreeDetail = () => {
  // 현재 URL의 state를 확인하기 위해 useLocation 사용
  const location = useLocation();

  // 상태 값 정의 (type: 게시글 상태 관리, post: 게시글 데이터 저장)
  const [type, setType] = useState(0); // 0: 기본값, "create": 등록, "update": 수정
  const postPkNumInt = parseInt(useParams().postPkNum, 10); // URL 파라미터에서 게시글 ID 추출
  const navigate = useNavigate();
  const [post, setPost] = useState({}); // 게시글 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

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
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/board/free/${postPkNumInt}`); // 게시글 데이터 요청
        setPost(response.data); // 성공 시 게시글 데이터 저장
      } catch (err) {
        setError(err.message); // 에러 발생 시 에러 메시지 설정
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchPost(); // 게시글 데이터 요청 함수 호출
  }, [postPkNumInt, location.state]);

  // 토스트 알림 상태 및 토글 함수
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => {
    setShowA(true); // 토스트 표시
    setTimeout(() => {
      setShowA(false); // 3초 후 토스트 숨기기
    }, 3000);
  };

  // 게시글 삭제 처리 함수
  const handleDelete = async () => {
    try {
      await axios.delete(`/board/free/${postPkNumInt}`); // 게시글 삭제 요청
      navigate("/main/free", { state: { success: true } }); // 삭제 후 목록 페이지로 이동
    } catch (err) {
      setError("삭제 실패: " + err.message); // 삭제 실패 시 에러 메시지 설정
    }
  };

  // 로딩 중일 때 표시
  if (loading) return <div>Loading...</div>;
  // 에러 발생 시 표시
  if (error) return <div>Error: {error}</div>;

  return (
    <Container fluid style={{ Height: "40em", marginTop: "2em" }}>
      <Card style={{ Height: "40em", overflowY: "auto", zIndex: 100 }}>
        <CardHeader>
          <h2>자유게시판</h2> {/* 카드 제목 */}
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
            {post ? (
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
                      {post.post_name} {/* 게시글 제목 */}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>조 회 수</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {post.post_view}회 {/* 조회수 */}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>작 성 자</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {post.user_name} {/* 작성자 */}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>우선순위</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {post.post_import} {/* 우선순위 */}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>작 성 일</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {new Date(post.post_regdate)
                        .toISOString()
                        .split("T")[0]}{" "}
                      {/* 작성일 */}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}> 내 용</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {post.post_content} {/* 게시글 내용 */}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div>게시글을 찾을 수 없습니다.</div>
            )}
            <br />

            {/* 버튼 섹션 */}
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/main/free/update/${postPkNumInt}`)}
            >
              수정 {/* 수정 버튼 */}
            </button>
            <button className="btn btn-primary" onClick={handleDelete}>
              삭제 {/* 삭제 버튼 */}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/main/free")}
            >
              목록 {/* 목록으로 돌아가기 버튼 */}
            </button>
          </div>
          <br />
          <div>댓글 공간</div> {/* 댓글 공간 표시 */}
        </CardBody>
      </Card>
      {/* 토스트 컴포넌트 */}
      <PostToast type={type} showA={showA} toggleShowA={toggleShowA} />
    </Container>
  );
};

export default FreeDetail;