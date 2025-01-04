import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import TaskDeleteModal from "./TaskDeleteModal";

const TaskList = (props) => {
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const projpkNum = sessionStorage.getItem("persist:proj_pk_num");
  const userInfo = JSON.parse(userInfoFromRoot);
  const userPkNum = userInfo.user_pk_num; //사번
  const compPkNum = userInfo.user_fk_comp_num; //회사번호

  const navigate = useNavigate();
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

  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const { projectNum } = useParams();

  const fetchTasks = useCallback(
    (page, block, sortField, sortDirection) => {
      // console.log("fetchTasks 호출:", {
      //   page,
      //   block,
      //   sortField,
      //   sortDirection,
      //   searchText,
      // });
      setLoading(true);
      setError(null);
      axiosInstance
        .get(
          `/conect/task/task/tasklist/proj/${props.projPkNum}?page=${
            page - 1
          }&pageBlock=${block}&sortField=${sortField}&sortDirection=${sortDirection}&searchText=${searchText}`
        )
        .then((res) => {
          // console.log("API 응답:", res.data);
          setTasks(res.data.tasks);
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
    [projectNum, searchText, props.projPkNum]
  );

  useEffect(() => {
    // console.log("useEffect 실행, projectNum:", projectNum);
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

  const handleSearch = () => {
    fetchTasks(1, 0, sortField, sortDirection);
  };

  const handleEditTask = (taskId) => {
    navigate(`/main/task/edit/${props.projPkNum}/${taskId}`);
  };

  const handleDeleteClick = (taskId) => {
    setSelectedTaskId(taskId);
    setDeleteModal(true);
  };

  //--------------------------------------------------------------------------------
  const [deleteModal, setDeleteModal] = useState(false);
  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(
        `/conect/${compPkNum}/task/task/delete/${selectedTaskId}`
      );

      setDeleteModal(false);
      setSelectedTaskId(null);
      fetchTasks(currentPage, pageBlock, sortField, sortDirection);
    } catch (error) {
      console.error("Delete task error:", error);
      setError("태스크 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal(false);
    setSelectedTaskId(null);
  };

  //--------------------------------------------------------------------------------
  const handleCreateTask = () => {
    navigate(`/main/task/create/${props.projPkNum}`);
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
                    <th></th>
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
                            <span style={{ marginRight: "5px" }}></span>
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
                        {userInfo.user_author == 2 ||
                        userInfo.user_author == 3 ? (
                          <td>
                            <UncontrolledDropdown>
                              <DropdownToggle
                                color="link"
                                size="sm"
                                className="p-0"
                              >
                                <i className="fas fa-ellipsis-v"></i>
                              </DropdownToggle>
                              <DropdownMenu right>
                                <DropdownItem
                                  onClick={() => handleEditTask(task.taskPkNum)}
                                >
                                  수정
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() =>
                                    handleDeleteClick(task.taskPkNum)
                                  }
                                >
                                  삭제
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>
                        ) : null}
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
                {userInfo.user_author == 2 || userInfo.user_author == 3 ? (
                  <button
                    className="btn btn-primary mr-3 mt-3"
                    onClick={handleCreateTask}
                  >
                    업무 생성
                  </button>
                ) : null}
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
          <TaskDeleteModal
            deleteModal={deleteModal}
            handleDeleteConfirm={handleDeleteConfirm}
            handleDeleteCancel={handleDeleteCancel}
          />
        </CardBody>
      </Card>
    </Container>
  );
};

export default TaskList;
