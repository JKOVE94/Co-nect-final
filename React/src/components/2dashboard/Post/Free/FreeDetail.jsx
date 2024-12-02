import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, CardBody, CardHeader, Container } from "reactstrap";

const FreeDetail = () => {
    const postPkNumInt = parseInt(useParams().postPkNum, 10); // URL에서 'postPkNum'을 추출하고 숫자로 변환
    console.log(postPkNumInt)
    const navigate = useNavigate();
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/board/free/${postPkNumInt}`); // 백엔드 API 호출
                console.log(response)
                setPost(response.data); // 게시글 데이터를 상태에 저장
                console.log(response.data)
            
            } catch (err) {
                setError(err.message); // 에러 처리
            } finally {
                setLoading(false); // 로딩 상태 종료
            }
        };

        fetchPost();
    }, []);

     // 삭제 함수
     const handleDelete = async () => {
        try {
            await axios.delete(`/board/free/${postPkNumInt}`); // 삭제 API 호출
            navigate('/board/free'); // 삭제 후 목록 페이지로 이동
        } catch (err) {
            setError("삭제 실패: " + err.message); // 삭제 실패 시 에러 처리
        }
    };

    if (loading) return <div>Loading...</div>; // 로딩 중일 때
    if (error) return <div>Error: {error}</div>; // 에러 발생 시

    return (
        <Container fluid style={{ marginTop: "2em" }}>
       <Row>
       <Col>
      <Card>
      <CardHeader>
      <h2>자유게시판</h2>
      </CardHeader>
      <CardBody style={{ maxHeight: "40em", overflowY: "auto",fontSize: "1.2rem" }}>
        <div>
            {post ? (
                <table className="table" style={{ fontSize: "1.2rem" }}>
                    <tbody>
                   <tr>제    목  {post.post_name}</tr> {/* 게시글 제목 */}
                   <tr>대상번호  {post.post_targetnum}</tr>
                   <tr>중 요 도  {post.post_import}</tr> {/* 게시글 중요도 */}
                   <tr>내    용 {post.post_content} </tr> {/* 게시글 내용 */}
                   </tbody>
                
                   <br/>
                    {/* 수정 버튼 */}
                    <button className="btn btn-primary" onClick={() => navigate(`/main/free/update/${postPkNumInt}`)}>수정</button>&nbsp;&nbsp;

                    {/* 삭제 버튼 */}
                    <button className="btn btn-primary" onClick={handleDelete}>삭제</button>&nbsp;&nbsp;
                    {/* 목록 버튼 */}
                    <button className="btn btn-primary" onClick={() => navigate('/main/free')}>목록</button>

                </table>
            ) : (
                <div>게시글을 찾을 수 없습니다.</div>
            )}
            
        </div>
     </CardBody>
         </Card>
         </Col>
         </Row>
         </Container>
    );
};

export default FreeDetail;