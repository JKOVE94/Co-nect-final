import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  Table,
} from "reactstrap";
import TaskDepthContainer from "./TaskDepthContainer";
import TaskHistoryModal from "./TaskHistoryModal";
import TaskDeleteModal from "./TaskDeleteModal";

const TaskDetail = () => {
  const { taskPkNum } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userPkNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호

  //--------------------------------------------------------------------------------
  const [deleteModal, setDeleteModal] = useState(false);
  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(
        `/conect/${compNum}/task/task/delete/${taskPkNum}`
      );

      setDeleteModal(false);
      navigate(`/main/task/${task.taskFkProjNum}`);
    } catch (error) {
      console.error("Delete task error:", error);
      setError("태스크 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal(false);
  };

  //--------------------------------------------------------------------------------

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axiosInstance.get(
          `/conect/${compNum}/task/task/${taskPkNum}`
        );
        setTask(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskPkNum]);

  const handleDeleteClick = () => {
    setDeleteModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "날짜 없음";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "유효하지 않은 날짜"
      : date.toISOString().split("T")[0];
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;

  return (
    <Container fluid style={{ height: "40em", marginTop: "2em" }}>
      <Row style={{ height: "auto" }}>
        <Col>
          <Card style={{ height: "auto", overflowY: "auto" }}>
            <CardHeader>
              <h2>업무 상세보기</h2>
              <button className="btn btn-primary m-1" onClick={openModal}>
                수정이력
              </button>
            </CardHeader>
            <CardBody style={{ fontSize: "1.2rem", padding: "0" }}>
              <Table responsive style={{ fontSize: "1.2rem" }}>
                <tbody>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>제 목</td>
                    <td colSpan="3" style={{ width: "90%", textAlign: "left" }}>
                      {task.taskTitle}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>내 용</td>
                    <td style={{ width: "40%", textAlign: "left" }}>
                      {task.taskContent}
                    </td>
                    <td style={{ width: "10%", textAlign: "left" }}>담당자</td>
                    <td style={{ width: "40%", textAlign: "left" }}>
                      {task.userName}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>상 태</td>
                    <td style={{ width: "40%", textAlign: "left" }}>
                      {task.taskStatus}
                    </td>
                    <td style={{ width: "10%", textAlign: "left" }}>진행도</td>
                    <td style={{ width: "40%", textAlign: "left" }}>
                      {task.taskProgress}%
                    </td>
                  </tr>
                  <tr>
                    <td style={{ width: "10%", textAlign: "left" }}>시작일</td>
                    <td style={{ width: "40%", textAlign: "left" }}>
                      {formatDate(task.taskStartdate)}
                    </td>
                    <td style={{ width: "10%", textAlign: "left" }}>마감일</td>
                    <td style={{ minWidth: "40%", textAlign: "left" }}>
                      {formatDate(task.taskDeadline)}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    {userInfo.user_author == 2 || userInfo.user_author == 3 ? (
                      <td colSpan="4" style={{ textAlign: "right" }}>
                        <button
                          className="btn btn-primary m-1"
                          onClick={() =>
                            navigate(
                              `/main/task/edit/${task.taskFkProjNum}/${taskPkNum}`
                            )
                          }
                        >
                          수정
                        </button>
                        <button
                          className="btn btn-danger m-1"
                          onClick={handleDeleteClick}
                        >
                          삭제
                        </button>
                        <button
                          className="btn btn-secondary m-1"
                          onClick={() =>
                            navigate(`/main/task/${task.taskFkProjNum}`)
                          }
                        >
                          목록
                        </button>
                      </td>
                    ) : null}
                  </tr>
                </tfoot>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="pt-3">
        <Col>
          <TaskDepthContainer task={task} />
        </Col>
      </Row>
      <TaskHistoryModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        taskPkNum={taskPkNum}
      />
      <TaskDeleteModal
        deleteModal={deleteModal}
        handleDeleteConfirm={handleDeleteConfirm}
        handleDeleteCancel={handleDeleteCancel}
      />
    </Container>
  );
};

export default TaskDetail;
