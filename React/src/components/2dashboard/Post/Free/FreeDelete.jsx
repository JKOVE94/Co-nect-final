import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FreeDelete = ({ postPkNum }) => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            try {
                // 삭제 API 호출
                await axios.delete(`/board/free/${postPkNum}`);
                alert("게시글이 성공적으로 삭제되었습니다.");
                navigate("/main/free"); // 게시글 목록 페이지로 이동
            } catch (error) {
                console.error("게시글 삭제 중 오류 발생:", error);
                alert("게시글 삭제에 실패했습니다. 다시 시도해 주세요.");
            }
        }
    };

    return (
        <button onClick={handleDelete} style={{ color: "red", cursor: "pointer" }}>
            삭제
        </button>
    );
};

export default FreeDelete;