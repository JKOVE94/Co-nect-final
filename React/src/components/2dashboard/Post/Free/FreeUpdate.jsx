import React, { useState, useEffect } from "react"; // React에서 상태 관리와 생명주기 훅 사용
import axios from "axios"; // HTTP 요청을 위한 Axios 라이브러리 임포트
import { useParams, useNavigate } from "react-router-dom"; // React Router의 파라미터와 네비게이션 기능
import { Card, CardBody, CardHeader, Container } from "reactstrap"; // Reactstrap을 활용한 UI 컴포넌트

const FreeUpdate = () => {
    const { postPkNum } = useParams(); // URL에서 'postPkNum' 파라미터 추출
    const navigate = useNavigate(); // 페이지 이동을 위한 네비게이션 훅
    const [post, setPost] = useState({
        post_name: "", // 게시글 제목
        post_import: "", // 우선순위
        post_content: "", // 게시글 내용
        post_targetnum: "", // 대상 번호
        user_name: "", // 작성자 이름
    });

    // 컴포넌트 로드 시 기존 게시글 데이터를 가져오는 함수
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/board/free/${postPkNum}`);
                setPost(response.data); // 서버에서 받은 게시글 데이터 설정
            } catch (error) {
                console.error("Error fetching post:", error); // 오류 처리
            }
        };

        fetchPost(); // 함수 호출
    }, [postPkNum]);

    // 입력 필드 변경 시 상태를 업데이트하는 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value }); // 입력된 값으로 상태 갱신
    };

    // 폼 제출 시 수정된 게시글 데이터를 서버에 전송하는 함수
    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 동작 방지
        try {
            const response = await axios.put(`/board/free/${postPkNum}`, post);
            if (response.status === 200) {
                // 수정 성공 시 상세 페이지로 이동하며 상태 전달
                navigate(`/main/free/detail/${postPkNum}`, {
                    state: { actionType: "update" },
                });
            }
        } catch (error) {
            console.error("Error updating post:", error); // 오류 처리
            alert("게시글 수정에 실패했습니다. 다시 시도해 주세요.");
        }
    };

    // 취소 버튼 클릭 시 상세보기 페이지로 이동
    const handleDetail = () => {
        navigate(`/main/free/detail/${postPkNum}`);
    };

    return (
        <Container fluid style={{ Height: "40em", marginTop: "2em" }}>
            <Card style={{ Height: "40em", overflowY: "auto", zIndex: 100 }}>
                <CardHeader>
                    <h2>게시글 수정</h2>
                </CardHeader>
                <CardBody
                    style={{
                        maxHeight: "40em",
                        overflowY: "auto",
                        fontSize: "1.2rem",
                        marginTop: "1em",
                    }}
                >
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
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleSubmit}
                        >
                            수정
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleDetail}
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                        >
                            임시저장
                        </button>
                    </form>
                </CardBody>
            </Card>
        </Container>
    );
};

export default FreeUpdate;