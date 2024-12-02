import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FreeCreate = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        post_name: "",
        post_targetnum: "",
        post_import: "",
        post_content: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/board/free`, post);
            alert("게시글이 성공적으로 생성되었습니다.");
            navigate("/posts");
        } catch (error) {
            console.error("Error creating post:", error);
            alert("게시글 생성에 실패했습니다. 다시 시도해 주세요.");
        }
    };

    return (
        <div>
            <h1>게시글 생성</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>제목:</label>
                    <input
                        type="text"
                        name="post_name"
                        value={post.post_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>대상 사원번호:</label>
                    <input
                        type="text"
                        name="post_targetnum"
                        value={post.post_targetnum}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>중요도:</label>
                    <input
                        type="text"
                        name="post_import"
                        value={post.post_import}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>내용:</label>
                    <textarea
                        name="post_content"
                        value={post.post_content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">생성</button>
            </form>
        </div>
    );
};

export default FreeCreate;