import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns"; // 날짜 포맷팅
import { Card, CardBody, CardHeader, Container } from "reactstrap";

const FreeList = () => {
  const [post, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 (전체 페이지 중)
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [pageBlock, setPageBlock] = useState(0); // 현재 페이지 블록 (5개씩 묶임)
  const [totalBlocks, setTotalBlocks] = useState(0); // 전체 블록 수
  const navigate = useNavigate();
  
  const fetchPosts = (page, block) => {
    axios
      .get(`/board/free?page=${page}&pageBlock=${block}`)
      .then((res) => {
        setPosts(res.data.posts);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
        setTotalBlocks(res.data.totalBlocks);
      })
      .catch((error) => {
        console.error("Axios 요청 중 오류 발생:", error);
      });
  };

  useEffect(() => {
    fetchPosts(0, 0); // 초기 페이지와 블록 설정
  }, []);

 // 페이지 블록을 나누는 로직
 const pagesPerBlock = 5; // 한 블록에 5개 페이지
 const startPageOfBlock = pageBlock * pagesPerBlock; // 현재블럭 * 블럭 당 페이지 수
 const endPageOfBlock = Math.min(startPageOfBlock + pagesPerBlock, totalPages);
 // 블럭당 시작페이지 + 블럭당 페이지 수, 전체페이지 중 작은 값 반환
 
// 페이지 버튼 생성
const pageButtons = Array.from(
  { length: endPageOfBlock - startPageOfBlock },
  (_, index) => startPageOfBlock + index
);
  // 페이지 블록 이동 함수
  const handlePageBlockChange = (direction) => {
    const newPageBlock = pageBlock + direction;
    setPageBlock(newPageBlock);
    fetchPosts(newPageBlock * pagesPerBlock, newPageBlock);
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchPosts(pageNumber, Math.floor(pageNumber / pagesPerBlock));
  };
  
  
  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd"); // YYYY-MM-DD 형식으로 변환
  };
  

  return (
    <Container fluid style={{Height: "60em", marginTop: "2em" }}>
     <Card style={{ Height: "40em", overflowY: "auto" }}>
      <CardHeader>
      <h2>자유 게시판</h2>
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
          {post.length > 0 ? (
            post.map((post, index) => (
              <tr key={post.post_pk_num || `post-${index}`}>
                <td>{post.post_pk_num}</td>
                <td>
                  <Link to={`/main/free/detail/${post.post_pk_num}`}>
                    {post.post_name}
                  </Link>
                </td>
                <td>{post.post_fk_user_num}</td>
                <td>{formatDate(post.post_regdate)}</td>
                <td>{post.post_view}</td>
              </tr>
            ))
          ) : (
            // 게시글이 없을 경우
            <tr>
              <td colSpan="4">게시글이 없습니다.</td>
            </tr>
          )}
           <button className="btn btn-primary" onClick={() => navigate(`/main/free/create`)}>글쓰기</button>
        </tbody>
        </table>
         {/* 페이지 네비게이션 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* 이전 블록 버튼 */}
        <button
          className={`btn btn-link ${pageBlock === 0 ? "disabled" : ""}`}
          onClick={() => pageBlock > 0 && handlePageBlockChange(-1)} // 클릭하지 않도록 처리
          disabled={pageBlock === 0}
        >
          &laquo; 이전
        </button>

        {/* 페이지 버튼 */}
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

        {/* 다음 블록 버튼 */}
        <button
          className={`btn btn-link ${
            pageBlock + 1 >= totalBlocks ? "disabled" : ""
          }`}
          onClick={() =>
            pageBlock + 1 < totalBlocks && handlePageBlockChange(1)
          } // 클릭하지 않도록 처리
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
