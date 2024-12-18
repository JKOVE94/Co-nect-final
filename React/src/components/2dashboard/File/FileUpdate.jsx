import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";


const FileUpdate = () => {
    const { filePkNum } = useParams(); // URL에서 'filePkNum'을 추출하고 숫자로 변환
    const navigate = useNavigate();
    const [file, setFile] = useState({
        file_name: "",
        file_path: "",
        file_size: "",
        file_type: "",  
        wiki_title: "",
        wiki_content:"",
        wiki_regdate:"",
        wiki_view:""
    });

    useEffect(() => {
        // 기존 게시글 데이터 가져오기
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/file/${filePkNum}`);
                setFile(response.data);
            } catch (error) {
                console.error("Error fetching file:", error);
            }
        };

        fetchPost();
    }, [filePkNum]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFile({ ...file, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.put(`/file/${filePkNum}`, file);
          if (response.status === 200) {
            // 수정 성공 시 상태 전달
            navigate(`/main/file/detail/${filePkNum}`, { state: { success: true } });
          }
        } catch (error) {
          console.error("Error updating file:", error);
          alert("게시글 수정에 실패했습니다. 다시 시도해 주세요.");
        }
      };

    const handleDitail = () => {
        // 수정하지 않고 상세보기 페이지로 이동
        navigate(`/main/file/detail/${filePkNum}`);
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
                    <label htmlFor="wiki_title">제목:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="wiki_title"
                        name="wiki_title"
                        value={file.wiki_title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="wiki_content">내용:</label>
                    <textarea
                        className="form-control"
                        id="wiki_content"
                        name="wiki_content"
                        value={file.wiki_content}
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

export default FileUpdate;