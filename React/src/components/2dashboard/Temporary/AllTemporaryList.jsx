import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns"; // 날짜 포맷팅
import { Card, CardBody, CardHeader, Container } from "reactstrap";

const AllTemporaryList = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // 임시 저장 게시물 가져오기
  const fetchTemporaryPosts = () => {
    axios
      .get(`/board/temporary`) // 
      .then((res) => {
        setPosts(res.data); // API 응답 데이터 사용
      })
      .catch((error) => {
        console.error("Axios 요청 중 오류 발생:", error);
      });
  };

  useEffect(() => {
    fetchTemporaryPosts(); // 컴포넌트 로드 시 데이터 가져오기
  }, []);

  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd");
  };

  return (
    <Container fluid style={{ height: "40em", marginTop: "1em" }}>
      <Card style={{ height: "40em", overflowY: "auto" }}>
        <CardHeader>
          <h2>임시 저장</h2>
        </CardHeader>
        <CardBody style={{ height: "40em", overflowY: "auto" }}>
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
                      <Link to={`update/${post.post_pk_num}`}>
                        {post.post_name}
                      </Link>
                    </td>
                    <td>{post.user_name || "알 수 없음"}</td>
                    <td>{formatDate(post.post_regdate)}</td>
                    <td>{post.post_view || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">게시글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          </CardBody>
      </Card>
    </Container>
  );
};

export default AllTemporaryList;