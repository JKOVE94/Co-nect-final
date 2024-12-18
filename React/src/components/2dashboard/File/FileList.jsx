import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns"; // 날짜 포맷팅
import { Card, CardBody, CardHeader, Container } from "reactstrap";

const FileList = () => {
  const [files, setFiles] = useState([]);

  // 파일 데이터를 가져오는 함수
  const fetchFiles = () => {
    axios
      .get("/file/") // 파일 목록 API 호출
      .then((res) => {
        if (Array.isArray(res.data.files)) {
          setFiles(res.data.files);
        } else {
          console.error("파일 목록이 배열이 아닙니다.");
        }      })
      .catch((error) => {
        console.error("파일을 불러오는 중 오류 발생:", error);
      });
  };

  useEffect(() => {
    fetchFiles(); // 컴포넌트 마운트 시 파일 목록을 불러옵니다.
  }, []);

  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd");
  };

  return (
    <Container fluid style={{ marginTop: "1em" }}>
      <Card style={{ height: "40em", overflowY: "auto" }}>
        <CardHeader>
          <h2>파일 게시판</h2>
        </CardHeader>
        <CardBody style={{ height: "40em", overflowY: "auto" }}>
          <table className="table" style={{ fontSize: "1.2rem" }}>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 ? (
                files.map((file) => (
                  <tr key={file.file_pk_num}>
                    <td>{file.file_pk_num}</td>
                    <td>
                      <Link to={`/main/file/detail/${file.file_pk_num}`}>
                        {file.file_name}
                      </Link>
                    </td>
                    <td>{file.user_name}</td>
                    <td>{formatDate(file.wiki_regdate)}</td>
                    <td>{file.wiki_view}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">파일이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          <button
            className="btn btn-primary"
            onClick={() => window.location.href = '/main/file/create'} // 글쓰기 버튼 클릭 시 글 작성 페이지로 이동
          >
            글쓰기
          </button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FileList;
