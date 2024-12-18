import axios from "axios"; // Axios를 사용하여 HTTP 요청을 보냄
import React, { useState, useEffect } from "react"; // React 훅 사용
import { Link, useNavigate } from "react-router-dom"; // React Router의 Link와 useNavigate 사용
import { format } from "date-fns"; // 날짜 포맷팅을 위한 라이브러리
import { Card, CardBody, CardHeader, Container } from "reactstrap"; // 부트스트랩 스타일링을 위한 컴포넌트
import { Button } from "react-bootstrap";

const NotiList = () => {
  // 상태 정의
  const [notices, setNotices] = useState([]); // 공지 목록
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수
  const [sortField, setSortField] = useState("notiRegdate"); // 정렬 필드 (기본값: 등록일)
  const [sortDirection, setSortDirection] = useState("DESC"); // 정렬 방향 (기본값: 내림차순)
  const [searchType, setSearchType] = useState(""); // 검색 분류 (제목, 작성자)
  const [searchText, setSearchText] = useState(""); // 검색어

  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
  const projNum = 6; // 테스트 projNum
  const compPkNum = 1; // 테스트 compNum

  // 게시글 데이터를 가져오는 함수
  const fetchNotices = (
    page,
    sortField,
    sortDirection,
    searchType,
    searchText
  ) => {
    axios
      .get(`/main/${compPkNum}/notice/list/${projNum}`, {
        params: {
          page: page,
          sortField: sortField,
          sortDirection: sortDirection,
          searchType: searchType,
          searchText: searchText,
        },
      })
      .then((res) => {
        console.log(res.data);
        setNotices(res.data); // 받아온 데이터로 상태 업데이트
      })
      .catch((error) => {
        console.error("Axios 요청 중 오류 발생:", error); // 에러 처리
      });
  };

  // 컴포넌트가 마운트될 때 게시글을 가져옴
  useEffect(() => {
    fetchNotices(0, sortField, sortDirection, searchType, searchText); // 첫 번째 페이지 데이터를 가져옴
  }, [sortField, sortDirection, searchType, searchText]); // 정렬 필드나 방향, 검색 조건이 변경될 때마다 게시글을 다시 가져옴

  const handleSearch = () => {
    setCurrentPage(0); // 검색 시 첫 페이지로 초기화
    fetchNotices(0, sortField, sortDirection, searchType, searchText); // 검색에 맞는 게시글을 가져옴
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
              <option value="noti_title">제목</option>
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
                <th>등록일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {notices.length > 0 ? (
                notices.map((notice, index) => (
                  <tr key={notice.noti_pk_num || `notice-${index}`}>
                    <td>{notice.noti_pk_num}</td>
                    <td>
                      <Link to={`/main/noti/notidetail/${notice.noti_pk_num}`}>
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
      {/* 공지사항 등록 버튼 */}
      <Button
        color="primary"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
        }}
        onClick={() => navigate("/main/noti/notiadd")}
      >
        공지 등록
      </Button>
    </Container>
  );
};

export default NotiList;
