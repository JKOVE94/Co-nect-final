import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import FavorCheck from "../Favorite/FavorCheck";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";


const FileDetail = () => {
  const filePkNumInt = parseInt(useParams().filePkNum, 10); 
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //즐겨찾기
  const num = useSelector((state) => state.userData.user_pk_num);
  const [favorList, setFavorList] = useState();
  const handleFavorite = () => {
    axios
      .get(`/favorite/post/${num}/${filePkNumInt}`)
      .then((res) => {
        setFavorList(res.data);
      })
      .catch((err)=>{
        setFavorList(false);
      });
  };
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/file/${filePkNumInt}`); 
        setPost(response.data); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };
    

    fetchPost();
    handleFavorite();
  },[filePkNumInt]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/file/${filePkNumInt}`); 
      navigate("/main/file", { state: { success: true } }); 
    } catch (err) {
      setError("삭제 실패: " + err.message); 
    }
  };

  if (loading) return <div>Loading...</div>; 
  if (error) return <div>Error: {error}</div>; 

  return (
    <Container fluid style={{ Height: "40em", marginTop: "2em" }}>
      <Card style={{ Height: "40em", overflowY: "auto" }}>
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
                      {post.file_post_name}&nbsp;
                      <FavorCheck 
                        type="post"
                        pknum={post.file_pk_num}
                        favorList={favorList}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>파 일</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {post.file_name}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}> 내 용</td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {post.file_content}
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
                onClick={() => navigate(`/main/free/update/${filePkNumInt}`)}
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
    </Container>
  );
};

export default FileDetail;