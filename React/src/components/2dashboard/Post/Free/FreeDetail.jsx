import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, CardBody, CardHeader, Container } from "reactstrap";
import PostTost from "variables/Toast/PostToast";

const FreeDetail = () => {
    const postPkNumInt = parseInt(useParams().postPkNum, 10); // URL에서 'postPkNum'을 추출하고 숫자로 변환
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
 //부트스트랩 토스트 토글용
 const [Success, setSuccess] = useState(false);
 const toggleSuccess = () => {
     setSuccess(true)
     setTimeout(() => {setSuccess(false)}, 3000)
 }

 useEffect(()=> {
    toggleSuccess();
 })
 //저장 실패 시 에러 타입 설정
 const [errType, setErrType] = useState(0); 
    if (loading) return <div>Loading...</div>; // 로딩 중일 때
    if (error) return <div>Error: {error}</div>; // 에러 발생 시
    return (
        <Container fluid style={{ marginTop: "2em" }}>
       
      <Card>
      <CardHeader>
      <h2>자유게시판</h2>
      </CardHeader>
      <CardBody style={{ maxHeight: "40em", overflowY: "auto",fontSize: "1.2rem" }}>
        <div>
            {post ? (
              <table className="table" style={{ fontSize: "1.2rem", border: "1px solid lightgray"}}>
              <tbody>
                  <tr>
                      <td style={{ width: "10%", textAlign: "left"  }}>제 목</td> 
                      <td style={{ width: "90%", textAlign: "left"  }}>{post.post_name}</td>
                  </tr>
                  <tr>
                      <td style={{ width: "10%", textAlign: "left"  }}>대상사원</td>  
                      <td style={{ width: "90%", textAlign: "left"  }}>{post.post_targetnum}</td>
                  </tr>
                  <tr>
                      <td style={{ width: "10%", textAlign: "left"  }}>중 요 도</td>  
                      <td style={{ width: "90%", textAlign: "left"  }}>{post.post_import}</td>
                  </tr>    
                  <tr>
                      <td style={{ width: "10%", textAlign: "left"  }}>작 성 일</td>  
                      <td style={{ width: "90%", textAlign: "left"  }}>{new Date(post.post_regdate).toISOString().split('T')[0]}</td>
                  </tr>                    
                  <tr>
                      <td style={{ width: "10%", textAlign: "left"  }}> 내    용</td> 
                      <td style={{ width: "90%", textAlign: "left"  }}>{post.post_content}</td> 
                  </tr>
              </tbody>
          </table>
          
            ) : (
                <div>게시글을 찾을 수 없습니다.</div>
            )}
                    <br/>
                    
                    <button className="btn btn-primary" onClick={() => navigate(`/main/free/update/${postPkNumInt}`)}>수정</button>
                    <button className="btn btn-primary" onClick={handleDelete}>삭제</button>
                    <button className="btn btn-primary" onClick={() => navigate('/main/free')}>목록</button>
                </div>
        <br/>
        <div>댓글 공간</div>
      <PostTost showA={Success} toggleShowA={toggleSuccess} type={errType} />
     </CardBody>
         </Card>
        
         </Container>
         
         

    );
};

export default FreeDetail;