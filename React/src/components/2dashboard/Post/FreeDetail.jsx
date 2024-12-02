import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

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

    if (loading) return <div>Loading...</div>; // 로딩 중일 때
    if (error) return <div>Error: {error}</div>; // 에러 발생 시

    return (
        <div>
            {post ? (
                <div>
                    <h2>제목 : {post.post_name}</h2> {/* 게시글 제목 */}
                    <h3>대상 사원 : {post.post_targetnum}</h3>
                    <h3>중요도 : {post.post_import}</h3> {/* 게시글 중요도 */}
                    <h3>내용 : {post.post_content}</h3> {/* 게시글 내용 */}

                    {/* 수정 버튼 */}
                    <button onClick={() => navigate(`/board/free/edit/${postPkNumInt}`)}>
                        수정
                    </button>

                    {/* 삭제 버튼 */}
                    <button onClick={handleDelete}>삭제</button>

                </div>
            ) : (
                <div>게시글을 찾을 수 없습니다.</div>
            )}
            <button onClick={() => navigate('/board/free')}>목록으로 돌아가기</button>
        </div>
    );
};

export default FreeDetail;