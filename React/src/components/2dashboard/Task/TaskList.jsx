import React, { useState, useEffect, useCallback } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import axiosInstance from "../../../api/axiosInstance";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Alert,
  Spinner,
  Progress,
  Input,
  Button,
  Col,
} from "reactstrap";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageBlock, setPageBlock] = useState(0);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [sortField, setSortField] = useState("taskCreated");
  const [sortDirection, setSortDirection] = useState("DESC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const { projectNum } = useParams();
  const compNum = useSelector((state) => state.userData.user_fk_comp_num);


  const fetchTasks = useCallback(
    (page, block, sortField, sortDirection) => {
      console.log("fetchTasks 호출:", {
        page,
        block,
        sortField,
        sortDirection,
        searchText,
      });
      setLoading(true);
      setError(null);
      axiosInstance
        .get(
          `/conect/${compNum}/board/tasklist/proj/${projectNum}?page=${
            page - 1
          }&pageBlock=${block}&sortField=${sortField}&sortDirection=${sortDirection}&searchText=${searchText}`
        )
        .then((res) => {
          console.log("API 응답:", res.data);
          setTasks(sortTasks(res.data.tasks));
          setCurrentPage(res.data.currentPage + 1);
          setTotalPages(res.data.totalPages);
          setTotalBlocks(res.data.totalBlocks);
          setLoading(false);
        })
        .catch((error) => {
          console.error("API 요청 오류:", error.response || error);
          setError(
            error.response?.data?.message ||
              "업무를 불러오는 중 오류가 발생했습니다."
          );
          setLoading(false);
        });
    },
    [projectNum, searchText]
  );

  useEffect(() => {
    console.log("useEffect 실행, projectNum:", projectNum);
    if (projectNum) {
      fetchTasks(1, 0, sortField, sortDirection);
    }
  }, [projectNum, sortField, sortDirection, fetchTasks]);

  const pagesPerBlock = 5;
  const startPageOfBlock = pageBlock * pagesPerBlock + 1;
  const endPageOfBlock = Math.min(
    startPageOfBlock + pagesPerBlock - 1,
    totalPages
  );
  const pageButtons = Array.from(
    { length: endPageOfBlock - startPageOfBlock + 1 },
    (_, index) => startPageOfBlock + index
  );

  const handlePageBlockChange = (direction) => {
    const newPageBlock = pageBlock + direction;
    setPageBlock(newPageBlock);
    fetchTasks(
      newPageBlock * pagesPerBlock + 1,
      newPageBlock,
      sortField,
      sortDirection
    );
  };

  const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
      if (a.taskGroup !== b.taskGroup) {
        return a.taskGroup - b.taskGroup;
      }
      return a.taskDepth - b.taskDepth;
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchTasks(
      pageNumber,
      Math.floor((pageNumber - 1) / pagesPerBlock),
      sortField,
      sortDirection
    );
  };

  const formatDate = (date) => {
    return format(new Date(date), "yyyy-MM-dd");
  };

  const handleSortChange = (event) => {
    const [newSortField, newSortDirection] = event.target.value.split("-");
    setSortField(newSortField);
    setSortDirection(newSortDirection);
  };

  const navigate = useNavigate();

  const handleTaskCreate = () => {
    navigate("/main/task/create");
  };
  const handleSearch = () => {
    fetchTasks(1, 0, sortField, sortDirection);
  };

  return (
    <Container fluid style={{ Height: "40em", marginTop: "1em" }}>
      <Card style={{ Height: "40em", overflowY: "auto" }}>
        <CardHeader>
          <h2>프로젝트 업무 목록</h2>
          <div className="row h-25">
            <Col xs="auto">
              <Input type="select" onChange={handleSortChange}>
                <option value="taskCreated-DESC">최신순</option>
                <option value="taskCreated-ASC">오래된순</option>
                <option value="taskProgress-DESC">진행도 높은순</option>
                <option value="taskProgress-ASC">진행도 낮은순</option>
              </Input>
            </Col>
            <Col>
              <Input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col xs="auto">
              <Button color="primary" onClick={handleSearch}>
                검색
              </Button>
            </Col>
          </div>
        </CardHeader>
        <CardBody className="p-0" style={{ Height: "40em", overflowY: "auto" }}>
          {loading && <Spinner color="primary" />}
          {error && <Alert color="danger">{error}</Alert>}
          {!loading && !error && (
            <>
              <table className="table" style={{ fontSize: "1.2rem" }}>
                <thead className="thead-light">
                  <tr>
                    <th>태스크</th>
                    <th>내용</th>
                    <th>시작일</th>
                    <th>마감일</th>
                    <th>상태</th>
                    <th>진행도</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <tr key={task.taskPkNum}>
                        <td
                          style={{
                            paddingLeft: `${task.taskDepth * 20}px`,
                            fontWeight:
                              task.taskDepth === 0 ? "bold" : "normal",
                          }}
                        >
                          {task.taskDepth === 1 && (
                            <span style={{ marginRight: "5px" }}>
                              <i class="bi bi-arrow-return-right"></i>
                            </span>
                          )}
                          <Link to={`/main/task/detail/${task.taskPkNum}`}>
                            {task.taskTitle}
                          </Link>
                        </td>

                        <td>{task.taskContent}</td>
                        <td>{formatDate(task.taskStartdate)}</td>
                        <td>{formatDate(task.taskDeadline)}</td>
                        <td>{task.taskStatus}</td>
                        <td
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Progress
                            value={task.taskProgress}
                            max={100}
                            style={{ height: "8px" }}
                          />
                          <div style={{ fontSize: "0.8rem", color: "#A0A0A0" }}>
                            {`진행률: ${task.taskProgress || 0}%`}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">업무가 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-primary mr-3 mt-3"
                  onClick={handleTaskCreate}
                >
                  글쓰기
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
                  className={`btn btn-link ${
                    pageBlock === 0 ? "disabled" : ""
                  }`}
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
                    {pageNumber}
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
            </>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default TaskList;
