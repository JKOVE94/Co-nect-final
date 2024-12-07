import axios from "axios"; // Axios를 사용하여 HTTP 요청을 보냄
import React, { useState, useEffect } from "react"; // React 훅 사용
import { Link, useNavigate } from "react-router-dom"; // React Router의 Link와 useNavigate 사용
import { format } from "date-fns"; // 날짜 포맷팅을 위한 라이브러리
import { Card, CardBody, CardHeader, Container } from "reactstrap"; // 부트스트랩 스타일링을 위한 컴포넌트

const FreeList = () => {
  // 상태 정의
  const [posts, setPosts] = useState([]); // 게시글 목록
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [pageBlock, setPageBlock] = useState(0); // 페이지 블록 번호 (페이지 그룹)
  const [totalBlocks, setTotalBlocks] = useState(0); // 전체 페이지 블록 수
  const [sortField, setSortField] = useState("postRegdate"); // 정렬 필드 (기본값: 등록일)
  const [sortDirection, setSortDirection] = useState("DESC"); // 정렬 방향 (기본값: 내림차순)

  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  // 게시글 데이터를 가져오는 함수
  const fetchPosts = (page, block, sortField, sortDirection) => {
    axios
      .get(`/board/free?page=${page}&pageBlock=${block}&sortField=${sortField}&sortDirection=${sortDirection}`)
      .then((res) => {
        setPosts(res.data.posts); // 게시글 목록 업데이트
        setCurrentPage(res.data.currentPage); // 현재 페이지 설정
        setTotalPages(res.data.totalPages); // 전체 페이지 수 설정
        setTotalBlocks(res.data.totalBlocks); // 전체 페이지 블록 수 설정
      })
      .catch((error) => {
        console.error("Axios 요청 중 오류 발생:", error); // 에러 처리
      });
  };

  // 컴포넌트가 마운트될 때 게시글을 가져옴
  useEffect(() => {
    fetchPosts(0, 0, sortField, sortDirection); // 첫 번째 페이지 데이터를 가져옴
  }, [sortField, sortDirection]); // 정렬 필드나 방향이 변경될 때마다 게시글을 다시 가져옴

  // 페이지 블록에서 한 번에 보여줄 페이지 수
  const pagesPerBlock = 5;
  const startPageOfBlock = pageBlock * pagesPerBlock; // 블록 시작 페이지
  const endPageOfBlock = Math.min(startPageOfBlock + pagesPerBlock, totalPages); // 블록 끝 페이지

  // 페이지 버튼 생성
  const pageButtons = Array.from(
    { length: endPageOfBlock - startPageOfBlock },
    (_, index) => startPageOfBlock + index
  );

  // 페이지 블록 이동 함수 (이전/다음)
  const handlePageBlockChange = (direction) => {
    const newPageBlock = pageBlock + direction; // 블록 번호를 변경
    setPageBlock(newPageBlock); // 새로운 블록 번호 설정
    fetchPosts(newPageBlock * pagesPerBlock, newPageBlock, sortField, sortDirection); // 해당 블록의 게시글을 가져옴
  };

  // 페이지 이동 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // 현재 페이지 설정
    fetchPosts(pageNumber, Math.floor(pageNumber / pagesPerBlock), sortField, sortDirection); // 해당 페이지의 게시글을 가져옴
  };

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd"); // 날짜를 'yyyy-MM-dd' 형식으로 변환
  };

  // 정렬 필드 변경 함수
  const handleSortChange = (field) => {
    // 정렬 필드 변경 시 방향을 토글 (기본: DESC)
    const newDirection = sortField === field && sortDirection === "DESC" ? "ASC" : "DESC";
    setSortField(field); // 정렬 필드 업데이트
    setSortDirection(newDirection); // 정렬 방향 업데이트
  };

  return (
    <Container fluid style={{ Height: "40em", marginTop: "1em" }}>
      <Card style={{ Height: "40em", overflowY: "auto" }}>
        <CardHeader>
          <h2>자유 게시판</h2>
          <div>
            <button
              className="btn btn-secondary"
              onClick={() => handleSortChange("postRegdate")}
            >
              최신순 {sortField === "postRegdate" && (sortDirection === "DESC" ? "▼" : "▲")}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleSortChange("postView")}
            >
              조회수순 {sortField === "postView" && (sortDirection === "DESC" ? "▼" : "▲")}
            </button>
          </div>
        </CardHeader>
        <CardBody style={{ Height: "40em", overflowY: "auto" }}>
          <table className="table" style={{ fontSize: "1.2rem" }}>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>등록일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <tr key={post.post_pk_num || `post-${index}`}>
                    <td>{post.post_pk_num}</td>
                    <td>
                      <Link to={`/main/free/detail/${post.post_pk_num}`}>
                        {post.post_name}
                      </Link>
                    </td>
                    <td>{post.user_name}</td>
                    <td>{formatDate(post.post_regdate)}</td>
                    <td>{post.post_view}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">게시글이 없습니다.</td>
                </tr>
              )}
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/main/free/create`)}
              >
                글쓰기
              </button>
            </tbody>
          </table>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              className={`btn btn-link ${pageBlock === 0 ? "disabled" : ""}`}
              onClick={() => pageBlock > 0 && handlePageBlockChange(-1)}
              disabled={pageBlock === 0}
            >
              &laquo; 이전
            </button>

            {pageButtons.map((pageNumber) => (
              <button
                key={pageNumber}
                className={`btn btn-link ${
                  currentPage === pageNumber ? "active" : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber + 1}
              </button>
            ))}

            <button
              className={`btn btn-link ${
                pageBlock + 1 >= totalBlocks ? "disabled" : ""
              }`}
              onClick={() =>
                pageBlock + 1 < totalBlocks && handlePageBlockChange(1)
              }
              disabled={pageBlock + 1 >= totalBlocks}
            >
              다음 &raquo;
            </button>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FreeList;