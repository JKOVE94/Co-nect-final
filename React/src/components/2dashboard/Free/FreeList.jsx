import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns"; // 날짜 포맷팅
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import Search from "variables/Search/Search";
import { useSelector } from "react-redux";
import FavorCheck from "../Favorite/FavorCheck";

const FreeList = () => {
 
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageBlock, setPageBlock] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0);
  //검색
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("");

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
    fetchPosts(0, 0);
    handleFavorite();
  }, []);

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
    fetchPosts(newPageBlock * pagesPerBlock, newPageBlock);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchPosts(pageNumber, Math.floor(pageNumber / pagesPerBlock));
  };

  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd");
  };

  //검색
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) handleSearch();
  };

  const handleChange = (e) => {
    if(e.target.id==="type"){
      setSearchType(e.target.value);
    } else if(e.target.id==="search") {
      setSearchText(e.target.value.trim());
    }
  };

  const handleSearch = () => {
    if(searchType === "" || searchType === null){
      return;
    } else {
      axios
      .get("/board/free")
      .then((res) => {
        const allData = res.data.posts;
        setPosts(
          allData.filter((data) =>
            data[searchType].replace(/\s+/g, "").includes(searchText)
          )
        );
      })
    }
  };

  //즐겨찾기
  const num = useSelector((state) => state.userData.user_pk_num);
  const [favorList, setFavorList] = useState([]);
  const handleFavorite = () => {
    axios
      .get(`/favorite/post/${num}`)
      .then((res) => {
          setFavorList(res.data);
      })
      .catch();
  };

  return (
    <Container fluid style={{ Height: "40em", marginTop: "1em" }}>
      <Card style={{ Height: "40em", overflowY: "auto" }}>
        <CardHeader>
          <h2>자유 게시판</h2>
          <Search
            type='post'
            value={searchText}
            onChange={handleChange}
            onSearch={handleSearch}
            onKeyDown={handleKeyDown}
          />
        </CardHeader>
        <CardBody style={{ Height: "40em", overflowY: "auto" }}>
          <table className="table" style={{ fontSize: "1.2rem" }}>
            <thead>
              <tr>
                <th style={{width:"80px"}}></th>
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
                    <td style={{display: 'flex', justifyContent: 'center'}}>
                      <FavorCheck
                        type="post"
                        pknum={post.post_pk_num}
                        favorList={favorList}
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