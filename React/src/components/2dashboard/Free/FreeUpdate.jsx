import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";


const FreeUpdate = () => {
    const { postPkNum } = useParams(); // URL에서 'postPkNum'을 추출하고 숫자로 변환
    const navigate = useNavigate();
    const [post, setPost] = useState({
        post_name: "",
        post_import: "",
        post_content: "",
        post_targetnum: "",  
        user_name: "",
    });

    useEffect(() => {
        // 기존 게시글 데이터 가져오기
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/board/free/${postPkNum}`);
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };

        fetchPost();
    }, [postPkNum]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.put(`/board/free/${postPkNum}`, post);
          if (response.status === 200) {
            // 수정 성공 시 상태 전달
            navigate(`/main/free/detail/${postPkNum}`, { state: { success: true } });
          }
        } catch (error) {
          console.error("Error updating post:", error);
          alert("게시글 수정에 실패했습니다. 다시 시도해 주세요.");
        }
      };

    const handleDitail = () => {
        // 수정하지 않고 상세보기 페이지로 이동
        navigate(`/main/free/detail/${postPkNum}`);
    };

    return (
        <Container fluid style={{Height: "40em", marginTop: "2em" }}>
           
              <Card style={{ Height: "40em", overflowY: "auto" }}>
              <CardHeader>
            <h2>게시글 수정</h2>
            </CardHeader>
            <CardBody style={{ maxHeight: "40em", overflowY: "auto",fontSize: "1.2rem",  marginTop: "1em"}}>
            <form onSubmit={handleSubmit}>
          <div className="form-group">
                    <label htmlFor="post_name">제목:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="post_name"
                        name="post_name"
                        value={post.post_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                      <div className="form-group">
                    <label htmlFor="post_import">우선순위:</label>
                    <select
                        className="form-control"
                        id="post_import"
                        name="post_import"
                        value={post.post_import}
                        onChange={handleChange}
                        required
                    >
                        <option>높음</option>
                        <option>중간</option>
                        <option>낮음</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="post_content">내용:</label>
                    <textarea
                        className="form-control"
                        id="post_content"
                        name="post_content"
                        value={post.post_content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="button"className="btn btn-secondary"onClick={handleSubmit}>수정</button>
                <button type="button"className="btn btn-secondary"onClick={handleDitail}>취소</button>
            </form>
            </CardBody>
        </Card>
        </Container>
    );
};

export default FreeUpdate;