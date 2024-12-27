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
} from "reactstrap";
import { Navigate, useNavigate } from "react-router-dom";

const TaskDepthContainer = ({ task }) => {
  const [relatedTasks, setRelatedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRelatedTasks = async () => {
      if (!task.taskGroup || !task.taskPkNum) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/board/task/${task.taskPkNum}/related`,
          {
            params: {
              taskGroup: task.taskGroup,
              taskDepth: task.taskDepth === 0 ? 1 : 0,
            },
          }
        );

        setRelatedTasks(response.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedTasks();
  }, [task]);

  if (loading) return <Spinner color="primary" />;
  if (error) return <Alert color="danger">{error}</Alert>;

  return (
    <Card style={{ height: "auto", width: "auto" }}>
      <CardHeader>
        {task.taskDepth === 0 ? (
          <>
            하위 업무
            <Button
              color="primary"
              className="m-1"
              onClick={() => Navigate(`/main/task/update/${task.taskPkNum}`)}
            >
              하위 업무 추가
            </Button>
          </>
        ) : (
          "상위 업무"
        )}
      </CardHeader>
      <CardBody className="p-0">
        {relatedTasks.length > 0 ? (
          relatedTasks.map((relatedTask) => (
            <Row style={{ height: "auto" }}>
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
                  <tr>
                    <td>{relatedTask.taskPkNum}</td>
                    <td>{relatedTask.taskTitle}</td>
                    <td>{relatedTask.userName}</td>
                    <td>{relatedTask.taskStatus}</td>
                    <td>{relatedTask.taskProgress}</td>
                  </tr>
                </tbody>
              </Table>
            </Row>
          ))
        ) : (
          <p className="pt-3 pl-3">- 관련 업무가 없습니다.</p>
        )}
      </CardBody>
    </Card>
  );
};

export default TaskDepthContainer;
