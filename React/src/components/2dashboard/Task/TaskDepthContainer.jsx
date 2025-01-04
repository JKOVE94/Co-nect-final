import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Alert,
  Button,
  Table,
  Row,
  Modal,
  ModalBody,
} from "reactstrap";
import TaskSubCreate from "./TaskSubCreate";

const TaskDepthContainer = ({ task }) => {
  const [relatedTasks, setRelatedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userInfo = JSON.parse(
    JSON.parse(sessionStorage.getItem("persist:root")).userData
  );
  const compPkNum = userInfo.user_fk_comp_num;

  const fetchRelatedTasks = async () => {
    if (!task.taskGroup && !task.taskPkNum) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/conect/${compPkNum}/task/task/${task.taskPkNum}/related`
      );
      // console.log("fetchRelatedTasks");
      // console.log(response.data);
      setRelatedTasks(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatedTasks();
  }, [task]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  if (loading) return <Spinner color="primary" />;
  if (error) return <Alert color="danger">{error}</Alert>;

  return (
    <Card style={{ height: "auto", width: "auto" }}>
      <CardHeader>
        {task.taskDepth === 0 ? (
          <>
            하위 업무
            {userInfo.user_author == 2 || userInfo.user_author == 3 ? (
              <Button color="primary" className="m-1" onClick={toggleModal}>
                하위 업무 추가
              </Button>
            ) : null}
          </>
        ) : (
          "상위 업무"
        )}
      </CardHeader>
      <CardBody className="p-0">
        {relatedTasks.length > 0 ? (
          <Table responsive>
            <thead className="thead-light">
              <tr>
                <th>번호</th>
                <th>태스크</th>
                <th>담당자</th>
                <th>상태</th>
                <th>진행도</th>
              </tr>
            </thead>
            <tbody>
              {relatedTasks.map((relatedTask) => (
                <tr key={relatedTask.taskPkNum}>
                  <td>{relatedTask.taskPkNum}</td>
                  <td>{relatedTask.taskTitle}</td>
                  <td>{relatedTask.userName}</td>
                  <td>{relatedTask.taskStatus}</td>
                  <td>{relatedTask.taskProgress}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="pt-3 pl-3">- 관련 업무가 없습니다.</p>
        )}
      </CardBody>

      <Modal
        isOpen={isModalOpen}
        toggle={toggleModal}
        size="lg"
        centered // 모달을 화면 중앙에 위치
        style={{ maxWidth: "800px" }} // 최대 너비 지정
      >
        <ModalBody className="p-4">
          {" "}
          {/* 패딩 추가 */}
          <TaskSubCreate
            projectNum={task.taskFkProjNum}
            parentTaskId={task.taskPkNum}
            parentTaskDepth={task.taskDepth}
            onClose={() => {
              toggleModal();
              fetchRelatedTasks();
            }}
            updateRelatedTasks={fetchRelatedTasks}
          />
        </ModalBody>
      </Modal>
    </Card>
  );
};

export default TaskDepthContainer;
