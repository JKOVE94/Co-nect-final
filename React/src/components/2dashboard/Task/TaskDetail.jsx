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

const TaskDetail = () => {
  const { taskPkNum } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const compNum = useSelector((state) => state.userData.user_fk_comp_num);


  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axiosInstance.get(`/conect/${compNum}/board/task/${taskPkNum}`);
        setTask(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskPkNum]);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/board/task/${taskPkNum}`);
      navigate("/main/tasklist", { state: { success: true } });
    } catch (err) {
      setError("삭제 실패: " + err.message);
    }
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
              <h2>태스크 상세보기</h2>
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
                    <td colSpan="4" style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-primary m-1"
                        onClick={() => navigate(`/main/task/update/${taskPkNum}`)}
                      >
                        수정
                      </button>
                      <button
                        className="btn btn-danger m-1"
                        onClick={handleDelete}
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
    </Container>
  );
};

export default TaskDetail;
