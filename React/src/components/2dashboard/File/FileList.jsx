import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns"; // 날짜 포맷팅
import { Card, CardBody, CardHeader, Container } from "reactstrap";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageBlock, setPageBlock] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const navigate = useNavigate();

  const fetchFiles = (page, block, sortField, sortDirection, searchType, searchText) => {
    axios
      .get("/file", { // 파일 목록 API 호출
        params: {
          page: page,
          pageBlock: block,
          sortField: sortField,
          sortDirection: sortDirection,
          searchType: searchType,
          searchText: searchText
        }
      })
      .then((res) => {
        if (Array.isArray(res.data.files)) {
          setFiles(res.data.files);
          setCurrentPage(res.data.currentPage);
          setTotalPages(res.data.totalPages);
          setTotalBlocks(res.data.totalBlocks);
        } else {
          console.error("파일 목록이 배열이 아닙니다.");
        }
      })
      .catch((error) => {
        console.error("파일을 불러오는 중 오류 발생:", error);
      });
  };

  const pagesPerBlock = 5;
  const startPageOfBlock = pageBlock * pagesPerBlock;
  const endPageOfBlock = Math.min(startPageOfBlock + pagesPerBlock, totalPages);

  const pageButtons = Array.from(
    { length: endPageOfBlock - startPageOfBlock },
    (_, index) => startPageOfBlock + index
  );

  const handlePageBlockChange = (direction) => {
    const newPageBlock = pageBlock + direction;
    setPageBlock(newPageBlock);
    fetchFiles(newPageBlock * pagesPerBlock, newPageBlock);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchFiles(pageNumber, Math.floor(pageNumber / pagesPerBlock));
  };

  useEffect(() => {
    fetchFiles(0, 0); // 컴포넌트 마운트 시 파일 목록을 불러옵니다.
  }, []);

  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd");
  };

  return (
    <Container fluid style={{ marginTop: "1em" }}>
      <Card style={{ height: "45em", position: "relative" }}>
        <CardHeader>
          <h2>파일 게시판</h2>
        </CardHeader>
        <CardBody style={{ height: "calc(100% - 4em)", overflowY: "hidden" }}>
          <table className="table" style={{ fontSize: "1.2rem" }}>
            <thead>
              <tr>
                <th>번호</th>
                <th>파일제목</th>
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
                    <td>{file.wiki.user_name}</td>
                    <td>{formatDate(file.wiki.wiki_regdate)}</td>
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1em"
            }}
          >
            <button
              className={`btn btn-link ${pageBlock === 0 ? "disabled" : ""}`}
              onClick={() => pageBlock > 0 && handlePageBlockChange(-1)}
              disabled={pageBlock === 0}
            >
              &laquo; 이전
            </button>

            {pageButtons.map((pageNumber) => (
              <button
                key={pageNumber}
                className={`btn btn-link ${currentPage === pageNumber ? "active" : ""}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber + 1}
              </button>
            ))}

            <button
              className={`btn btn-link ${pageBlock + 1 >= totalBlocks ? "disabled" : ""}`}
              onClick={() => pageBlock + 1 < totalBlocks && handlePageBlockChange(1)}
              disabled={pageBlock + 1 >= totalBlocks}
            >
              다음 &raquo;
            </button>
          </div>
          <button
            className="btn btn-primary"
            style={{
              position: "absolute",
              bottom: "2em",
              right: "2em"
            }}
            onClick={() => navigate('/main/file/create')} // 파일 업로드 버튼 클릭 시 업로드 페이지로 이동
          >
            파일 업로드
          </button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FileList;
