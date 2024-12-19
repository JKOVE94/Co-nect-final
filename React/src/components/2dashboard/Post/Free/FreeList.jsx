import axiosInstance from "../../../../api/axiosInstance";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns"; // 날짜 포맷팅
import { Card, CardBody, CardHeader, Container } from "reactstrap";

const FreeList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageBlock, setPageBlock] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [sortField, setSortField] = useState("postRegdate"); // 기본 정렬: 최신순
  const [sortDirection, setSortDirection] = useState("DESC"); // 기본 정렬 방향: 내림차순

  const navigate = useNavigate();

  const fetchPosts = (page, block, sortField, sortDirection) => {
    axiosInstance
      .get(
        `/board/free?page=${page}&pageBlock=${block}&sortField=${sortField}&sortDirection=${sortDirection}`
      )
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
    fetchPosts(0, 0, sortField, sortDirection);
  }, [sortField, sortDirection]);

  const pagesPerBlock = 5;
  const startPageOfBlock = pageBlock * pagesPerBlock;
  const endPageOfBlock = Math.min(startPageOfBlock + pagesPerBlock, totalPages);

  const pageButtons = Array.from(
    { length: endPageOfBlock - startPageOfBlock },
    (_, index) => startPageOfBlock + index
  );

  const handlePageBlockChange = (direction) => {
    const newPageBlock = pageBlock + direction;
    setPageBlock(newPageBlock);
    fetchPosts(
      newPageBlock * pagesPerBlock,
      newPageBlock,
      sortField,
      sortDirection
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchPosts(
      pageNumber,
      Math.floor(pageNumber / pagesPerBlock),
      sortField,
      sortDirection
    );
  };

  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd");
  };

  const handleSortChange = (field) => {
    // 정렬 필드 변경 시 방향을 토글 (기본: DESC)
    const newDirection =
      sortField === field && sortDirection === "DESC" ? "ASC" : "DESC";
    setSortField(field);
    setSortDirection(newDirection);
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
              최신순{" "}
              {sortField === "postRegdate" &&
                (sortDirection === "DESC" ? "▼" : "▲")}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleSortChange("postView")}
            >
              조회수순{" "}
              {sortField === "postView" &&
                (sortDirection === "DESC" ? "▼" : "▲")}
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
