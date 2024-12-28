import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns"; // 날짜 포맷팅
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";
import Search from "variables/Search/PostSearch";
import FavorCheck from "../Favorite/FavorCheck";
import "../../../assets/css/freepost/freelist.css";

const FreeList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageBlock, setPageBlock] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [sortField, setSortField] = useState("postRegdate"); // 기본 정렬: 최신순
  const [sortDirection, setSortDirection] = useState("DESC"); // 기본 정렬 방향: 내림차순

  //검색 type:title,name
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("");

  const navigate = useNavigate();

  const fetchPosts = (
    page,
    block,
    sortField,
    sortDirection,
    searchType,
    searchText
  ) => {
    axios
      .get("/board/free", {
        params: {
          page: page,
          pageBlock: block,
          sortField: sortField,
          sortDirection: sortDirection,
          searchType: searchType,
          searchText: searchText,
        },
      })
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
    fetchPosts(0, 0, sortField, sortDirection, searchType, searchText);
    handleFavorite();
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
      sortDirection,
      searchType,
      searchText
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchPosts(
      pageNumber,
      Math.floor(pageNumber / pagesPerBlock),
      sortField,
      sortDirection,
      searchType,
      searchText
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

  //검색
  const handleKeyDown = (e) => {
    //사용자가 enter입력 시 search 실행
    if (e.keyCode === 13) handleSearch();
  };
  const handleChange = (e) => {
    if (e.target.id === "type") {
      setSearchType(e.target.value);
    } else if (e.target.id === "search") {
      setSearchText(e.target.value.trim());
    }
  };

  const handleSearch = async () => {
    if (searchType === "" || searchType === null) {
      //사용자가 type을 선택하지 않았거나 입력값이 없을 경우 search 실행하지 않음
      return;
    } else {
      fetchPosts(0, 0, sortField, sortDirection, searchType, searchText);
    }
  };

  //즐겨찾기

  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const num = userInfo.user_pk_num; //사번
  const compPkNum = userInfo.user_fk_comp_num; //회사번호
  const [favorData, setFavorData] = useState([]);
  const handleFavorite = () => {
    axios
      .get(`/favorite/post/${num}`)
      .then((res) => {
        setFavorData(res.data);
      })
      .catch();
  };

  return (
    <Container fluid style={{ Height: "40em", marginTop: "1em" }}>
      <Card style={{ Height: "40em", overflowY: "auto" }}>
        <CardHeader
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2>자유 게시판</h2>
          <div style={{ display: "flex" }}>
            <button
              className="btn btn-secondary"
              style={{ marginTop: "0px", height: "43px" }}
              onClick={() => handleSortChange("postRegdate")}
            >
              최신순{" "}
              {sortField === "postRegdate" &&
                (sortDirection === "DESC" ? "▼" : "▲")}
            </button>
            <button
              className="btn btn-secondary"
              style={{ marginTop: "0px", height: "43px" }}
              onClick={() => handleSortChange("postView")}
            >
              조회수순{" "}
              {sortField === "postView" &&
                (sortDirection === "DESC" ? "▼" : "▲")}
            </button>
            <Search
              type="post"
              value={searchText}
              onChange={handleChange}
              onSearch={handleSearch}
              onKeyDown={handleKeyDown}
            />
          </div>
        </CardHeader>
        <CardBody style={{ Height: "40em", overflowY: "auto" }}>
          <table className="table" style={{ fontSize: "1.2rem" }}>
            <thead>
              <tr>
                <th style={{ width: "80px" }}></th>
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
                    <td style={{ display: "flex", justifyContent: "center" }}>
                      <FavorCheck
                        type="post"
                        pknum={post.post_pk_num}
                        favorData={favorData}
                      />
                    </td>
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
            </tbody>
          </table>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/main/free/create`)}
          >
            글쓰기
          </button>
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
