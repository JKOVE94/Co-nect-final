import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { CardBody } from "reactstrap";
import Search from "variables/Search/Search";
import FavorCheck from "./FavorCheck";
import { useSelector } from "react-redux";

const FreeList = () => {
  //검색
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("");

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
        const allData = res.data;
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
      .get(`/board/favorite/post/${num}`)
      .then((res) => {
          setFavorList(res.data);
      })
      .catch();
  };

  const [post, setPosts] = useState([]);

  const refresh = () => {
    axios
      .get("/board/free")
      .then((res) => {
        setPosts(res.data);
      })
      .catch((error) => {
        console.error("Axios 요청 중 오류 발생:", error);
      });
  }

  useEffect(() => {
    refresh();
    handleFavorite();
  }, []);

  const navigate = useNavigate();

  return (
    <Card>
      <CardBody>
        <Search
          type='post'
          value={searchText}
          onChange={handleChange}
          onSearch={handleSearch}
          onKeyDown={handleKeyDown}
        />
        <h2>게시글 목록</h2>
        <table className="table table-bordered" border={1}>
          <thead>
            <tr>
              <th></th>
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
                  <td>
                    <FavorCheck
                      type="post"
                      pknum={post.post_pk_num}
                      favorList={favorList}
                    />
                  </td>
                  <td>{post.post_pk_num}</td>
                  <td>
                    <Link to={`/board/free/${post.post_pk_num}`}>
                      {post.post_name}
                    </Link>
                  </td>
                  <td>{post.user_name}</td>
                  <td>{post.post_regdate}</td>
                  <td>{post.post_view}</td>
                </tr>
              ))
            ) : (
              // 게시글이 없을 경우
              <tr>
                <td colSpan="4">게시글이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        <Link to="/board/free/add">새 게시글 작성하기</Link>
      </CardBody>
    </Card>
  );
};

export default FreeList;
