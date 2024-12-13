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
  const { wikiPkNum } = useParams(); 
  const navigate = useNavigate();
  const [wiki, setWiki] = useState({}); // 게시글 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 화면 로드 시 실행되는 useEffect
  useEffect(() => {
    // 게시글 데이터 fetch 함수 정의
    const fetchWiki = async () => {
      try {
        const response = await axios.get(`/wiki/wikidetail/${wikiPkNum}`);
        setWiki(response.data); // 성공 시 게시글 데이터 저장
      } catch (err) {
        setError(err.message); // 에러 발생 시 에러 메시지 설정
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchWiki(); // 게시글 데이터 요청 함수 호출
  }, [wikiPkNum]);

  // 게시글 삭제 처리 함수
  const handleDelete = async () => {
    try {
      await axios.delete(`/wiki/wikidelete/${wikiPkNum}`); // 게시글 삭제 요청
      navigate("/main/wiki/wikilist", { state: { success: true } }); // 삭제 후 목록 페이지로 이동
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
          <h2>위키문서</h2> {/* 카드 제목 */}
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
                      {wiki.wiki_name} {/* 게시글 제목 */}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>작 성 자</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {wiki.user_name} {/* 작성자 */}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>작 성 일</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {new Date(wiki.wiki_regdate)
                        .toISOString()
                        .split("T")[0]}{" "}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}> 내 용</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {wiki.wiki_desc} {/* 게시글 내용 */}
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
              onClick={() => navigate(`/main/wiki/wikiedit/${wikiPkNum}`)}
            >
              수정 {/* 수정 버튼 */}
            </button>
            <button className="btn btn-primary" onClick={handleDelete}>
              삭제 {/* 삭제 버튼 */}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/main/wiki/wikilist")}
            >
              목록 {/* 목록으로 돌아가기 버튼 */}
            </button>
          </div>
          <br />
        </CardBody>
      </Card>

    </Container>
  );
};

export default FreeDetail;