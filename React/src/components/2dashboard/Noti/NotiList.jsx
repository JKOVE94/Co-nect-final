import axios from "axios"; // Axios를 사용하여 HTTP 요청을 보냄
import React, { useState, useEffect } from "react"; // React 훅 사용
import { Link, useNavigate } from "react-router-dom"; // React Router의 Link와 useNavigate 사용
import { format } from "date-fns"; // 날짜 포맷팅을 위한 라이브러리
import { Card, CardBody, CardHeader, Container } from "reactstrap"; // 부트스트랩 스타일링을 위한 컴포넌트
import { Button } from "react-bootstrap";
import axiosInstance from "../../../api/axiosInstance";

const NotiList = (props) => {
  // 상태 정의
  const [notices, setNotices] = useState([]); // 공지 목록
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [pageBlock, setPageBlock] = useState(0); // 페이지 블록 번호 (페이지 그룹)
  const [totalBlocks, setTotalBlocks] = useState(0); // 전체 페이지 블록 수
  const [sortField, setSortField] = useState("notiRegdate"); // 정렬 필드 (기본값: 등록일)
  const [sortDirection, setSortDirection] = useState("DESC"); // 정렬 방향 (기본값: 내림차순)
  const [searchType, setSearchType] = useState(""); // 검색 분류 (제목, 작성자)
  const [searchText, setSearchText] = useState(""); // 검색어

  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
  const pagesPerBlock = 5; // 한 블록당 페이지 수

  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;

  const userInfo = JSON.parse(userInfoFromRoot);
  const compPkNum = userInfo.user_fk_comp_num; //회사번호

  // 게시글 데이터를 가져오는 함수
  const fetchNotices = (
    page,
    sortField,
    sortDirection,
    searchType,
    searchText
  ) => {
    const validPage = page >= 0 ? page : 0; // 유효하지 않은 값 방지
    axiosInstance
      .get(`/conect/main/${compPkNum}/notice/list/${props.projPkNum}`, {
        params: {
          page: validPage,
          size: 7, // 한 페이지에 표시할 공지 게시글 수
          sortField: sortField,
          sortDirection: sortDirection,
          searchType: searchType,
          searchText: searchText,
        },
      })
      .then((res) => {
        // console.log("서버 응답:", res.data);
        // api/axiosInstance.js

        setNotices(res.data.content);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.number);
        setTotalBlocks(Math.ceil(res.data.totalPages / pagesPerBlock));
      })
      .catch((error) => {
        // console.log("현재 baseURL:", axiosInstance.defaults.baseURL); // baseURL 확인
        console.error("Axios 요청 중 오류 발생:", error);
      });
  };

  // 컴포넌트가 마운트될 때 게시글을 가져옴
  useEffect(() => {
    fetchNotices(currentPage, sortField, sortDirection, searchType, searchText);
  }, [
    currentPage,
    sortField,
    sortDirection,
    searchType,
    searchText,
    props.projPkNum,
  ]); // 정렬 필드나 방향, 검색 조건이 변경될 때마다 게시글을 다시 가져옴

  // 검색 처리 함수
  const handleSearch = () => {
    setCurrentPage(0); // 검색 시 첫 페이지로 초기화
    setPageBlock(0); // 검색 시 첫 블록으로 초기화
    fetchNotices(0, sortField, sortDirection, searchType, searchText); // 검색에 맞는 게시글을 가져옴
  };

  // 현재 블록의 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const startPage = Math.floor(currentPage / pagesPerBlock) * pagesPerBlock; // 현재 블록의 시작 페이지 계산
    const endPage = Math.min(startPage + pagesPerBlock, totalPages); // 현재 블록의 마지막 페이지 계산
    return Array.from({ length: endPage - startPage }, (_, i) => startPage + i);
  };

  // 이전 페이지로 이동
  const handlePrevPage = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      fetchNotices(prevPage, sortField, sortDirection, searchType, searchText);
    }
  };

  // 다음 페이지로 이동
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchNotices(nextPage, sortField, sortDirection, searchType, searchText);
    }
  };

  // 페이지 이동 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchNotices(pageNumber, sortField, sortDirection, searchType, searchText);
  };

  return (
    <Container fluid style={{ Height: "40em", marginTop: "1em" }}>
      <Card style={{ Height: "40em", overflowY: "auto" }}>
        <CardHeader>
          <h2>공지 사항</h2>
          <div>
            <select
              onChange={(e) => setSearchType(e.target.value)}
              value={searchType}
              style={{
                padding: "0.4em",
                fontSize: "1em",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "90px",
                transition: "border 0.3s ease",
              }}
            >
              <option value="">분류</option>
              <option value="title">제목</option>
              <option value="name">작성자</option>
            </select>
            &nbsp;&nbsp;&nbsp;
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                padding: "0.4em",
                fontSize: "1em",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "200px",
                transition: "border 0.3s ease",
              }}
            />
            &nbsp;&nbsp;&nbsp;
            <button
              onClick={handleSearch}
              style={{
                padding: "0.35em 0.8em",
                backgroundColor: "#f8f9fa",
                color: "#007bff",
                border: "1px solid #007bff",
                borderRadius: "5px",
                cursor: "pointer",
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#007bff";
                e.target.style.color = "white";
                e.target.style.borderColor = "#007bff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f8f9fa";
                e.target.style.color = "#007bff";
                e.target.style.borderColor = "#007bff";
              }}
            >
              검색
            </button>
          </div>
        </CardHeader>
        <CardBody style={{ Height: "40em", overflowY: "auto" }}>
          <table className="table" style={{ fontSize: "1.2rem" }}>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>등록일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {notices.length > 0 ? (
                notices.map((notice, index) => (
                  <tr key={notice.noti_pk_num || `notice-${index}`}>
                    <td>{notice.noti_pk_num}</td>
                    <td
                      style={{
                        textAlign: "left", // 왼쪽 정렬
                        paddingLeft: "50px", // 왼쪽 여백
                      }}
                    >
                      {notice.noti_import === 1 && (
                        <span style={{ marginRight: "0.5em" }}>
                          <i
                            className="bi bi-pin-angle-fill"
                            style={{ color: "red" }}
                          ></i>
                        </span>
                      )}
                      <Link
                        to={`/main/noti/notidetail/${notice.noti_pk_num}`}
                        style={{
                          fontWeight:
                            notice.noti_import === 1 ? "bold" : "normal",
                        }}
                      >
                        {notice.noti_title}
                      </Link>
                    </td>
                    <td>{notice.userName}</td>
                    <td>{notice.noti_regdate}</td>
                    <td>{notice.noti_view}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">게시글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      {userInfo.user_author == 2 || userInfo.user_author == 3 ? (
        <Button
          color="primary"
          style={{
            position: "relative",
            top: "6vh",
            right: "-70vw",
            zIndex: 1000,
          }}
          onClick={() => navigate("/main/noti/notiadd")}
        >
          공지 등록
        </Button>
      ) : null}

      {/* 페이지네이션 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1em",
        }}
      >
        <button
          className="btn btn-link"
          onClick={handlePrevPage}
          disabled={currentPage === 0} // 첫 페이지일 때만 비활성화
        >
          &laquo; 이전
        </button>

        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            className={`btn btn-link ${
              currentPage === pageNumber ? "active" : ""
            }`}
            onClick={() => handlePageChange(pageNumber)}
            style={{
              margin: "0 0.5em",
              padding: "0.5em 1em",
              fontWeight: currentPage === pageNumber ? "bold" : "normal",
              textDecoration: "none",
            }}
          >
            {pageNumber + 1}
          </button>
        ))}

        <button
          className="btn btn-link"
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1} // 마지막 페이지일때만 비활성화
        >
          다음 &raquo;
        </button>
      </div>
    </Container>
  );
};

export default NotiList;
