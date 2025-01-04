import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns"; // 날짜 포맷팅
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";
import SearchProject from "variables/Search/SearchProject";
import "../../../assets/css/freepost/freelist.css";
import ManagerProjDropdown from "variables/Dropdown/ManagerProjDropdown";
import ManageProjModal from "variables/Modal/ManageProjModal";
import axiosInstance from "api/axiosInstance";

const ProjList = (props) => {
  const [projs, setProjs] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageBlock, setPageBlock] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [sortField, setSortField] = useState("projTitle"); // 기본 정렬: 최신순
  const [sortDirection, setSortDirection] = useState("DESC"); // 기본 정렬 방향: 내림차순

  //검색 type:title,name
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("");
  const [projPkNumInt, setProjPkNumInt] = useState(0);

  const navigate = useNavigate();

  const fetchProjs = (
    page,
    block,
    sortField,
    sortDirection,
    searchType,
    searchText
  ) => {
    axiosInstance
      .get(`/conect/${props.compNum}/manage/proj`, {
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
        // console.log(res.data.projects);
        setProjs(res.data.projects);
        setCurrentPage(res.data.currentPage);
        setTotalPages(res.data.totalPages);
        setTotalBlocks(res.data.totalBlocks);
      })
      .catch((error) => {
        console.error("Axios 요청 중 오류 발생:", error);
      });
  };

  useEffect(() => {
    fetchProjs(0, 0, sortField, sortDirection, searchType, searchText);
  }, [sortField, sortDirection]);

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
    fetchProjs(
      newPageBlock * pagesPerBlock,
      newPageBlock,
      sortField,
      sortDirection,
      searchType,
      searchText
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchProjs(
      pageNumber,
      Math.floor(pageNumber / pagesPerBlock),
      sortField,
      sortDirection,
      searchType,
      searchText
    );
  };

  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd");
  };

  const handleSortChange = (field) => {
    // 정렬 필드 변경 시 방향을 토글 (기본: DESC)
    const newDirection =
      sortField === field && sortDirection === "DESC" ? "ASC" : "DESC";
    setSortField(field);
    setSortDirection(newDirection);
  };

  //검색
  const handleKeyDown = (e) => {
    //사용자가 enter입력 시 search 실행
    if (e.keyCode === 13) handleSearch();
  };
  const handleChange = (e) => {
    if (e.target.id === "type") {
      setSearchType(e.target.value);
    } else if (e.target.id === "search") {
      setSearchText(e.target.value.trim());
    }
  };

  const handleSearch = async () => {
    if (searchType === "" || searchType === null) {
      //사용자가 type을 선택하지 않았거나 입력값이 없을 경우 search 실행하지 않음
      return;
    } else {
      fetchProjs(0, 0, sortField, sortDirection, searchType, searchText);
    }
  };

  const [showM, setShowM] = useState(false); //모달 상태와 관련된 state
  const handleCloseM = () => setShowM(false); //모달을 닫는 함수
  const handleShowM = () => setShowM(true); //모달을 열어주는 함수
  const [type, setType] = useState(""); //모달 타입을 결정하는 state
  const handleDelete = async (projNum) => {
    setProjPkNumInt(projNum);
    handleShowM();
    setType("delete");
  };

  return (
    <Container fluid style={{ Height: "40em", marginTop: "1em" }}>
      <Card style={{ Height: "40em", overflowY: "auto" }}>
        <CardHeader
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <h2>프로젝트 게시판</h2>
          <div style={{ display: "flex" }}>
            <SearchProject
              type="proj"
              value={searchText}
              onChange={handleChange}
              onSearch={handleSearch}
              onKeyDown={handleKeyDown}
            />
          </div>
        </CardHeader>
        <CardBody style={{ Height: "40em", overflowY: "auto" }}>
          <table className="table" style={{ fontSize: "1.2rem" }}>
            <thead>
              <tr>
                <th
                  onClick={() => handleSortChange("projPkNum")}
                  style={{ cursor: "pointer" }}
                >
                  번호
                  {sortField === "projPkNum" &&
                    (sortDirection === "DESC" ? "▼" : "▲")}
                </th>
                <th
                  onClick={() => handleSortChange("projTitle")}
                  style={{ cursor: "pointer" }}
                >
                  제목
                  {sortField === "projTitle" &&
                    (sortDirection === "DESC" ? "▼" : "▲")}
                </th>
                <th
                  onClick={() => handleSortChange("userEntity.userName")}
                  style={{ cursor: "pointer" }}
                >
                  담당자
                  {sortField === "userEntity.userName" &&
                    (sortDirection === "DESC" ? "▼" : "▲")}
                </th>
                <th
                  onClick={() => handleSortChange("projCreated")}
                  style={{ cursor: "pointer" }}
                >
                  등록일
                  {sortField === "projCreated" &&
                    (sortDirection === "DESC" ? "▼" : "▲")}
                </th>
                <th>참여 인원 </th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {projs.length > 0 ? (
                projs.map((proj, index) => (
                  <tr key={proj.proj_pk_num || `post-${index}`}>
                    <td>{proj.proj_pk_num}</td>
                    <td>
                      <Link to={`/manage/proj/detail/${proj.proj_pk_num}`}>
                        {proj.proj_title}
                      </Link>
                    </td>
                    <td>{proj.proj_manager}</td>
                    <td>{proj.proj_created}</td>
                    <td>{proj.memberDtoList.length}</td>
                    <td>
                      {props.userInfo.user_author == 3 ||
                      (props.userInfo.user_author == 2 &&
                        proj.proj_fk_user_num == props.userInfo.user_pk_num) ? (
                        <ManagerProjDropdown
                          projNum={proj.proj_pk_num}
                          projTitle={proj.proj_title}
                          projManager={proj.proj_fk_user_num}
                          handleDelete={handleDelete}
                          userInfo={props.userInfo}
                        />
                      ) : (
                        <div>권한이 없습니다.</div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">등록된 프로젝트가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/manage/proj/create`)}
            style={{
              float: "left",
              position: "relative",
              marginTop: "2em",
              marginLeft: "1em",
            }}
          >
            프로젝트 등록
          </button>
          <div
            style={{
              position: "relative",
              left: "-2em",
              marginTop: "2em",
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
      <ManageProjModal
        handleCloseM={handleCloseM}
        handleShowM={handleShowM}
        showM={showM}
        type={type}
        projPkNumInt={projPkNumInt}
        compNum={props.compNum}
        setType={setType}
        fetchProjs={fetchProjs}
      />
    </Container>
  );
};

export default ProjList;
