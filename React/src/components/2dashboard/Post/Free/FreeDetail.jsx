import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import PostToast from "variables/Toast/PostToast";


const FreeDetail = () => {
  const location = useLocation();
  const [type, setType] = useState(0); // 0: 기본값, 1: 등록, 2: 수정
  const postPkNumInt = parseInt(useParams().postPkNum, 10); 
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    // 등록 또는 수정 상태인지 체크
    const actionType = location.state?.actionType;
    if (actionType === "create") {
      setType("create"); // 등록 상태
      toggleShowA(); // 토스트 표시
    } else if (actionType === "update") {
      setType("update"); // 수정 상태
      toggleShowA(); // 토스트 표시
    }
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/board/free/${postPkNumInt}`); 
        setPost(response.data); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };
    

    fetchPost();
  },[postPkNumInt, location.state]);

  const [showA, setShowA] = useState(false);
  const toggleShowA = () => {
    setShowA(true);
    setTimeout(() => {
      setShowA(false);
    }, 3000);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/board/free/${postPkNumInt}`); 
      navigate("/main/free", { state: { success: true } }); 
    } catch (err) {
      setError("삭제 실패: " + err.message); 
    }
  };

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>Error: {error}</div>; 

  return (
    <Container fluid style={{ Height: "40em", marginTop: "2em" }}>
      <Card style={{ Height: "40em", overflowY: "auto",zIndex: 100 }}>
        <CardHeader>
          <h2>자유게시판</h2>
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
                      {post.post_name}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>조 회 수</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {post.post_view}회
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>작 성 자</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {post.user_name}
                    </td>
                    </tr>
                     <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>우선순위</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {post.post_import}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>작 성 일</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {new Date(post.post_regdate).toISOString().split("T")[0]}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}> 내 용</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {post.post_content}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div>게시글을 찾을 수 없습니다.</div>
            )}
            <br />

            <button
              className="btn btn-primary"
              onClick={() => navigate(`/main/free/update/${postPkNumInt}`)}
            >
              수정
            </button>
            <button className="btn btn-primary" onClick={handleDelete}>
              삭제
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/main/free")}
            >
              목록
            </button>
          </div>
          <br />
          <div>댓글 공간</div>
        </CardBody>
      </Card>
      <PostToast type={type} showA={showA} toggleShowA={toggleShowA} />
    </Container>
  );
};

export default FreeDetail;
