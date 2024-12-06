import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Progress,
  Table,
  Container,
  Row,
  Pagination,
  PaginationItem,
  PaginationLink,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const ProjectTable = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const fetchHandle = useCallback(() => {
    setLoading(true);
    axios
      .get("/proj/projlist", {
        params: {
          filter,
          searchTerm,
          page: currentPage,
        },
      })
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filter, searchTerm, currentPage]);

  useEffect(() => {
    setCurrentPage(0);
    fetchHandle();
  }, [filter, searchTerm, fetchHandle]);

  const handleSearch = () => {
    setCurrentPage(0);
    fetchHandle();
  };

  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setSearchTerm(searchValue);
      fetchHandle();
    }, 100),
    [fetchHandle]
  );

  const handleSearchInputChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const dateForm = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEditProject = (projPkNum) => {
    navigate(`/main/proj/projedit/${projPkNum}`);
  };

  const handleDeleteProject = (projPkNum) => {
    navigate(`/delete-project/${projPkNum}`);
  };

  const renderProjectRows = () => {
    if (loading)
      return (
        <tr>
          <td colSpan="7" className="text-center">
            로딩 중...
          </td>
        </tr>
      );

    if (error)
      return (
        <tr>
          <td colSpan="7" className="text-center text-danger">
            {error}
          </td>
        </tr>
      );

    if (projects.length === 0)
      return (
        <tr>
          <td colSpan="7" className="text-center">
            데이터가 없습니다.
          </td>
        </tr>
      );

    return projects.slice(0, 8).map((project, index) => (
      <tr
        key={project.proj_pk_num || index}
        style={{ width: "100%", overflowX: "hidden" }}
      >
        <td className="text-center">
          <input
            type="checkbox"
            checked={project.favorite}
            onChange={(e) => {
              const newFavoriteStatus = e.target.checked;
              // 즐겨찾기 불러오기
            }}
          />
        </td>
        <td className="text-truncate" style={{ maxWidth: "150px" }}>
          <Link to={`/main/proj/projdetail/${project.proj_pk_num}/tree`}>
            {project.proj_name}
          </Link>
        </td>
        <td className="text-truncate" style={{ maxWidth: "200px" }}>
          {project.proj_desc}
        </td>
        <td>{project.proj_status}</td>
        <td>{dateForm(project.proj_enddate)}</td>
        <td>
          <div className="d-flex align-items-center">
            <span className="mr-2">{project.proj_progress}%</span>
            <div className="progress-container">
              <Progress
                max="100"
                value={project.proj_progress}
                barClassName={`bg-${
                  project.proj_progress === 100 ? "success" : "danger"
                }`}
              />
            </div>
          </div>
        </td>
        <td className="text-right">
          <UncontrolledDropdown>
            <DropdownToggle className="btn-icon-only" size="sm">
              <i className="fas fa-ellipsis-v" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem
                onClick={() => handleEditProject(project.proj_pk_num)}
              >
                수정
              </DropdownItem>
              <DropdownItem
                onClick={() => handleDeleteProject(project.proj_pk_num)}
              >
                삭제
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </td>
      </tr>
    ));
  };

  return (
    <>
      <Container className="mt--7" fluid style={{ overflowX: "auto" }}>
        <Row>
          <Col>
            <Card
              className="shadow d-flex flex-column"
              style={{
                marginTop: "95px", // 카드 위치 조정
              }}
            >
              <CardHeader
                className="d-flex align-items-center"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  paddingTop: "15px",
                  paddingBottom: "15px",
                  position: "sticky", // 스크롤 시 상단에 고정
                  top: "0", // 상단에 고정
                  backgroundColor: "white", // 배경색을 설정하여 가독성 향상
                  zIndex: 10, // 다른 요소들 위에 오도록 설정
                }}
              >
                <h1
                  className="mb-0"
                  style={{ flex: "1 0 auto", marginRight: "20px" }}
                >
                  프로젝트 목록
                </h1>
                <div
                  className="d-flex align-items-center"
                  style={{
                    flex: "0 1 auto",
                    gap: "10px",
                  }}
                >
                  <select
                    className="form-select"
                    style={{ width: "130px" }}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="전체">전체</option>
                    <option value="예정">예정</option>
                    <option value="진행중">진행중</option>
                    <option value="계획">계획</option>
                  </select>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "130px",
                      marginTop: "0",
                    }}
                    onClick={handleSearch}
                  >
                    검색
                  </button>
                </div>
              </CardHeader>

              <div
                className="table-responsive"
                style={{
                  flexGrow: 1,
                  display: "flex",
                  overflowX: "visible",
                  marginTop: "0px", // 테이블 위치 조정
                }}
              >
                <Table style={{ width: "100%", overflowX: "visible" }}>
                  <thead>
                    <tr>
                      <th className="text-center" style={{ width: "10%" }}>
                        즐겨찾기
                      </th>
                      <th style={{ width: "20%" }}>프로젝트</th>
                      <th style={{ width: "15%" }}>담당자</th>
                      <th style={{ width: "15%" }}>상태</th>
                      <th style={{ width: "15%" }}>기한</th>
                      <th style={{ width: "15%" }}>진행도</th>
                      <th className="text-right" style={{ width: "10%" }}>
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ overflowX: "visible" }}>
                    {renderProjectRows()}
                  </tbody>
                </Table>
              </div>

              <CardFooter
                className="d-flex justify-content-between align-items-center mt-auto "
                style={{
                  backgroundColor: "white",
                  zIndex: 10,
                }}
              >
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/main/proj/projadd")}
                >
                  프로젝트 생성
                </button>
                <Pagination>
                  <PaginationItem disabled={currentPage === 0}>
                    <PaginationLink
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      이전
                    </PaginationLink>
                  </PaginationItem>
                  {[0, 1, 2].map((page) => (
                    <PaginationItem active={currentPage === page} key={page}>
                      <PaginationLink onClick={() => setCurrentPage(page)}>
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      다음
                    </PaginationLink>
                  </PaginationItem>
                </Pagination>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProjectTable;
