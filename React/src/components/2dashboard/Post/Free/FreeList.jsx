import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns"; // 날짜 포맷팅
import { Row, Col, Card, CardBody, CardHeader, Container } from "reactstrap";

const FreeList = () => {
  const [post, setPosts] = useState([]);

  const refresh = () => {
    axios
      .get("/board/free")
      .then((res) => {
        console.log(res.data); // 서버 응답 데이터 출력
        setPosts(res.data);
      })
      .catch((error) => {
        console.error("Axios 요청 중 오류 발생:", error);
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  const navigate = useNavigate();

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd"); // YYYY-MM-DD 형식으로 변환
  };

  return (
    <Container fluid style={{ marginTop: "2em" }}>
     <Card fluid>
      <CardHeader>
      <h2>자유 게시판</h2>
      </CardHeader> 
      <CardBody style={{ maxHeight: "50em", overflowY: "auto" }}>
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
        </CardBody>
        </Card>
       
      </Container>
  );
};

export default FreeList;
