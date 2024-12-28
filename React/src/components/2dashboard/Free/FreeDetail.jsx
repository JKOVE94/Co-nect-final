import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import FavorCheck from "../Favorite/FavorCheck";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";

const FreeDetail = () => {
  const postPkNumInt = parseInt(useParams().postPkNum, 10);
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //즐겨찾기
  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const num = userInfo.user_pk_num; //사번
  const compPkNum = userInfo.user_fk_comp_num; //회사번호

  const [favorList, setFavorList] = useState();
  const handleFavorite = () => {
    axios
      .get(`/favorite/post/${num}/${postPkNumInt}`)
      .then((res) => {
        setFavorList(res.data);
      })
      .catch((err) => {
        setFavorList(false);
      });
  };

  useEffect(() => {
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
    handleFavorite();
  }, [postPkNumInt]);

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
                      {post.post_name}&nbsp;
                      <FavorCheck
                        type="post"
                        pknum={post.post_pk_num}
                        favorList={favorList}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>
                      작 성 자
                    </td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {post.user_name}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>
                      우선순위
                    </td>
                    <td style={{ width: "90%", textAlign: "left" }}>
                      {post.post_import}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>
                      작 성 일
                    </td>
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
        </CardBody>
      </Card>
    </Container>
  );
};

export default FreeDetail;
