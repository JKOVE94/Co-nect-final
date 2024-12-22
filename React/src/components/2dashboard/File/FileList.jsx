import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns"; // 날짜 포맷팅
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import FileSearch from "variables/Search/FileSearch";
import Search from "variables/Search/Search";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageBlock, setPageBlock] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [sortField, setSortField] = useState("wikiRegdate"); // 기본 정렬: 최신순
  const [sortDirection, setSortDirection] = useState("DESC"); // 기본 정렬 방향: 내림차순
  
  //검색 type:title,name
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("");

  const navigate = useNavigate();

  const fetchFiles = (page, block, sortField, sortDirection, searchType, searchText) => {
    axios
      .get("/file", {
        params: {
          page: page,
          pageBlock: block,
          sortField: sortField,
          sortDirection: sortDirection,
          searchType: searchType,
          searchText: searchText,
        },
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

  // 파일 다운로드
  const handleDownload = async (filePkNum, fileName) => {
    try {
      const response = await axios.get(`/file/download/${filePkNum}`, {
        responseType: "blob", // 파일 데이터를 받아오기 위해 blob 타입으로 설정
      });
  
      // 브라우저에서 다운로드 처리
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", decodeURIComponent(fileName)); // 파일 이름 설정
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("파일 다운로드 중 오류:", error);
      alert("파일을 다운로드하는 중 오류가 발생했습니다.");
    }
  };
  
  // 페이징
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
      fetchFiles(0, 0, sortField, sortDirection, searchType, searchText);
    }, [sortField, sortDirection]);

  // 날짜 포맷팅
  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd");
  };

  // 정렬
  const handleSortChange = (field) => {
    const newDirection = sortField === field && sortDirection === "DESC" ? "ASC" : "DESC";
    setSortField(field);
    setSortDirection(newDirection);
  
    // 정렬 필드와 방향이 변경되었으므로 즉시 데이터를 다시 가져옵니다.
    fetchFiles(currentPage, pageBlock, field, newDirection, searchType, searchText);
  };
  

  //검색
  const handleKeyDown = (e) => {
    //사용자가 enter입력 시 search 실행
    if (e.keyCode === 13) handleSearch();
  };
  const handleChange = (e) => {
    if(e.target.id==="type"){
      setSearchType(e.target.value);
    } else if(e.target.id==="search") {
      setSearchText(e.target.value.trim());
    }
  };

  const handleSearch = async () => {
    if(searchType === "" || searchType === null){
      //사용자가 type을 선택하지 않았거나 입력값이 없을 경우 search 실행하지 않음
      return;
    } else {
      fetchFiles(0, 0, sortField, sortDirection, searchType, searchText);
    }
  };


  return (
    <Container fluid style={{ marginTop: "1em" }}>
      <Card style={{ height: "45em", position: "relative" }}>
        <CardHeader>
          <h2>파일 게시판</h2>
          <FileSearch
              value={searchText}
              onChange={handleChange}
              onSearch={handleSearch}
              onKeyDown={handleKeyDown}
            />
        </CardHeader>
        <CardBody style={{ height: "calc(100% - 4em)", overflowY: "hidden" }}>
          <table className="table" style={{ fontSize: "1.2rem" }}>
            <thead>
              <tr>
                <th>번호</th>
                <th>파일제목</th>
                <th>작성자</th>
                <th
                  onClick={() => handleSortChange("wikiRegdate")}
                  style={{ cursor: "pointer" }}
                >
                  작성일
                  {sortField === "wikiRegdate" &&
                    (sortDirection === "DESC" ? "▼" : "▲")}
                </th>
                <th
                  onClick={() => handleSortChange("wikiView")}
                  style={{ cursor: "pointer" }}
                >
                  조회수
                  {sortField === "wikiView" &&
                    (sortDirection === "DESC" ? "▼" : "▲")}
                </th>
              </tr>
            </thead>
            <tbody>
              {files.length > 0 ? (
                files.map((file) => (
                  <tr key={file.file_pk_num}>
                    <td>{file.file_pk_num}</td>
                    <td>
                      <Link to={`/main/file/detail/${file.file_pk_num}`}>
                        {file.wiki.wiki_isnotice && (
                          <span
                            style={{
                              color: "goldenrod",
                              marginRight: "0.5em",
                              display: "inline-block",
                            }}
                          >
                            <i className="fas fa-bell"></i>
                          </span>
                        )}
                        {file.file_name}
                      </Link>
                      <span
                        title="파일 다운로드"
                        style={{ cursor: "pointer", marginLeft: "0.5em", color: "blue" }}
                        onClick={() => handleDownload(file.file_pk_num, file.file_name)}
                      >
                        📥
                      </span>
                    </td>
                    <td>{file.wiki.user_name}</td>
                    <td>{formatDate(file.wiki.wiki_regdate)}</td>
                    <td>{file.wiki.wiki_view}</td>
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
              marginTop: "1em",
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
              right: "2em",
            }}
            onClick={() => navigate("/main/file/create")}
          >
            파일 업로드
          </button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FileList;
