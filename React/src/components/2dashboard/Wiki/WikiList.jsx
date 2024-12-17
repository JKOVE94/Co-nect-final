import axios from "axios"; // Axios를 사용하여 HTTP 요청을 보냄
import React, { useState, useEffect } from "react"; // React 훅 사용
import { Link, useNavigate } from "react-router-dom"; // React Router의 Link와 useNavigate 사용
import { format } from "date-fns"; // 날짜 포맷팅을 위한 라이브러리
import { Card, CardBody, CardHeader, Container } from "reactstrap"; // 부트스트랩 스타일링을 위한 컴포넌트

const WikiList = () => {
  // 상태 정의
  const [wikis, setWikis] = useState([]); // 게시글 목록
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [pageBlock, setPageBlock] = useState(0); // 페이지 블록 번호 (페이지 그룹)
  const [totalBlocks, setTotalBlocks] = useState(0); // 전체 페이지 블록 수
  const [sortField, setSortField] = useState("wikiRegdate"); // 정렬 필드 (기본값: 등록일)
  const [sortDirection, setSortDirection] = useState("DESC"); // 정렬 방향 (기본값: 내림차순)
  const [searchType, setSearchType] = useState(""); // 검색 분류 (제목, 작성자)
  const [searchText, setSearchText] = useState(""); // 검색어

  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  // 게시글 데이터를 가져오는 함수
  const fetchWikis = (
    page,
    block,
    sortField,
    sortDirection,
    searchType,
    searchText
  ) => {
    axios
      .get(
        `/wiki/wikilist?page=${page}&pageBlock=${block}&sortField=${sortField}&sortDirection=${sortDirection}&searchType=${searchType}&searchText=${searchText}`
      )
      .then((res) => {
        console.log(res.data);
        if (res.data && res.data.wikis) {
          const allWikis = res.data.wikis || [];
          const noticeWikis = allWikis.filter((wiki) => wiki.wiki_isnotice); // 공지사항 필터링
          const regularWikis = allWikis.filter((wiki) => !wiki.wiki_isnotice); // 일반 게시글

          setWikis([...noticeWikis, ...regularWikis]); // 공지사항을 상단에 배치
          setCurrentPage(res.data.currentPage); // 현재 페이지 설정
          setTotalPages(res.data.totalPages); // 전체 페이지 수 설정
          setTotalBlocks(res.data.totalBlocks); // 전체 페이지 블록 수 설정
        } else {
          setWikis([]);
        }
      })
      .catch((error) => {
        console.error("Axios 요청 중 오류 발생:", error); // 에러 처리
      });
  };

  // 컴포넌트가 마운트될 때 게시글을 가져옴
  useEffect(() => {
    fetchWikis(0, 0, sortField, sortDirection); // 첫 번째 페이지 데이터를 가져옴
  }, [sortField, sortDirection]); // 정렬 필드나 방향이 변경될 때마다 게시글을 다시 가져옴

  // 페이지 블록에서 한 번에 보여줄 페이지 수
  const pagesPerBlock = 5;
  const startPageOfBlock = pageBlock * pagesPerBlock; // 블록 시작 페이지
  const endPageOfBlock = Math.min(startPageOfBlock + pagesPerBlock, totalPages); // 블록 끝 페이지

  // 페이지 버튼 생성
  const pageButtons = Array.from(
    { length: endPageOfBlock - startPageOfBlock },
    (_, index) => startPageOfBlock + index
  );

  // 페이지 블록 이동 함수 (이전/다음)
  const handlePageBlockChange = (direction) => {
    const newPageBlock = pageBlock + direction; // 블록 번호를 변경
    setPageBlock(newPageBlock); // 새로운 블록 번호 설정
    fetchWikis(
      newPageBlock * pagesPerBlock,
      newPageBlock,
      sortField,
      sortDirection
    ); // 해당 블록의 게시글을 가져옴
  };

  // 페이지 이동 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // 현재 페이지 설정
    fetchWikis(
      pageNumber,
      Math.floor(pageNumber / pagesPerBlock),
      sortField,
      sortDirection
    ); // 해당 페이지의 게시글을 가져옴
  };

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd"); // 날짜를 'yyyy-MM-dd' 형식으로 변환
  };

  // 정렬 필드 변경 함수
  const handleSortChange = (field) => {
    // 정렬 필드 변경 시 방향을 토글 (기본: DESC)
    const newDirection =
      sortField === field && sortDirection === "DESC" ? "ASC" : "DESC";
    setSortField(field); // 정렬 필드 업데이트
    setSortDirection(newDirection); // 정렬 방향 업데이트
  };

  const handleSearch = () => {
    setPageBlock(0); // 검색 시 페이지를 초기화
    fetchWikis(0, 0, sortField, sortDirection, searchType, searchText);
  };

  return (
    <Container fluid style={{ Height: "40em", marginTop: "1em" }}>
      <Card style={{ Height: "40em", overflowY: "auto" }}>
        <CardHeader>
          <h2>문서 게시판</h2>
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
              <option value="wiki_title">제목</option>
              <option value="user_name">작성자</option>
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
                backgroundColor: "#f8f9fa", // 기본 배경색 회색
                color: "#007bff", // 기본 글자 색상 파란색
                border: "1px solid #007bff", // 기본 테두리 색상 파란색
                borderRadius: "5px",
                cursor: "pointer",
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#007bff"; // 마우스 오버 시 배경색을 파란색으로 변경
                e.target.style.color = "white"; // 마우스 오버 시 글자 색을 흰색으로 변경
                e.target.style.borderColor = "#007bff"; // 마우스 오버 시 테두리 색상 유지
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f8f9fa"; // 마우스 아웃 시 배경색을 회색으로 복귀
                e.target.style.color = "#007bff"; // 마우스 아웃 시 글자 색을 파란색으로 복귀
                e.target.style.borderColor = "#007bff"; // 마우스 아웃 시 테두리 색상 유지
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
                <th>
                  등록일{" "}
                  <button
                    onClick={() => handleSortChange("wikiRegdate")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "10px",
                      padding: "0",
                    }}
                  >
                    {sortDirection === "ASC" ? "▲" : "▼"}{" "}
                    {/* 과거순일 경우 ▲, 최신순일 경우 ▼ */}
                  </button>
                </th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {wikis.length > 0 ? (
                // 공지글을 먼저 배치하도록 wikis 배열을 정렬
                wikis
                .sort((a, b) => {
                  // 먼저 공지글 정렬
                  if (a.wiki_isnotice !== b.wiki_isnotice) {
                    return b.wiki_isnotice - a.wiki_isnotice;
                  }
                  // 날짜 정렬 (최신순, 과거순)
                  if (sortDirection === "ASC") {
                    return new Date(a.wiki_regdate) - new Date(b.wiki_regdate); // 과거순
                  } else {
                    return new Date(b.wiki_pk_num) - new Date(a.wiki_pk_num); // 최신순
                  }
                })
                  .map((wiki, index) => (
                    <tr
                      key={wiki.wiki_pk_num || `wiki-${index}`}
                      style={{
                        fontWeight:
                          wiki.wiki_isnotice === true ? "bold" : "normal",
                        backgroundColor: wiki.wiki_isnotice
                          ? "#f0f0f0"
                          : "transparent",
                      }}
                    >
                      <td>{wiki.wiki_pk_num}</td>
                      <td>
                        {wiki.wiki_isnotice === true && ( // 공지사항일 때만 표시
                          <span role="img" aria-label="bell">
                            🔔 &nbsp;
                          </span>
                        )}
                        <Link to={`/main/wiki/wikidetail/${wiki.wiki_pk_num}`}>
                          {wiki.wiki_title}
                        </Link>
                      </td>
                      <td>{wiki.user_name}</td>
                      <td>{formatDate(wiki.wiki_regdate)}</td>
                      <td>{wiki.wiki_view}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="5">게시글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          <br />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/main/wiki/wikiadd`)}
            >
              문서 등록
            </button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
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
                className={`btn btn-link ${
                  currentPage === pageNumber ? "active" : ""
                }`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber + 1}
              </button>
            ))}

            <button
              className={`btn btn-link ${
                pageBlock + 1 >= totalBlocks ? "disabled" : ""
              }`}
              onClick={() =>
                pageBlock + 1 < totalBlocks && handlePageBlockChange(1)
              }
              disabled={pageBlock + 1 >= totalBlocks}
            >
              다음 &raquo;
            </button>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default WikiList;
