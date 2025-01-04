import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../api/axiosInstance";

import {
  Button,
  Col,
  Card,
  Table,
  Row,
  Progress,
  Container,
  CardHeader,
} from "reactstrap";

export default function Tasktable(props) {
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const compNum = userInfo.user_fk_comp_num; //회사번호
  const [tasks, setTasks] = useState([]);
  // console.log(props.projPkNum);
  const navigate = useNavigate();
  const [userNum, setUserNum] = useState(userInfo.user_pk_num);

  const showList = useCallback(() => {
    if (!props.projPkNum || !userNum) {
      console.error("프로젝트 번호 또는 사용자 번호가 유효하지 않습니다.");
      return;
    }

    axiosInstance
      .get(
        `/conect/${compNum}/task/task/proj/${props.projPkNum}/user/${userNum}`
      )
      .then((res) => {
        const sortData = res.data
          .sort((a, b) => new Date(b.taskStartdate) - new Date(a.taskStartdate))
          .slice(0, 4);
        setTasks(sortData);
        // console.log(tasks);
      })
      .catch((error) => {
        console.error("showList 오류:", error);
      });
  }, [props.projPkNum, userNum]);

  useEffect(() => {
    if (props.projPkNum && userNum) {
      showList();
    }
  }, [props.projPkNum, userNum, showList]);

  const gotoTaskLists = () => {
    navigate(`/main/task/${props.projPkNum}`);
  };

  // 기한 날짜 yyyy-mm-dd 양식 설정
  const dateForm = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <Container
      fluid
      style={{
        marginTop: "2rem",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Row
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          maxHeight: "45vh",
        }}
      >
        <Col lg={13} style={{ width: "100%", height: "100%" }}>
          <Card style={{ width: "100%" }}>
            <CardHeader className="border-0">
              <h3 className="mb-0" style={{ fontWeight: "bold" }}>
                나의 업무
              </h3>
              <Button
                color="outline-primary"
                size="sm"
                className="btnview"
                onClick={gotoTaskLists}
              >
                더 보기
              </Button>
            </CardHeader>
            <Table responsive>
              <thead className="thead-light">
                <tr style={{ color: "gray", textAlign: "center" }}>
                  <th style={{ fontSize: "1rem" }}>태스크</th>
                  <th style={{ fontSize: "1rem" }}>상태</th>
                  <th style={{ fontSize: "1rem" }}>시작일</th>
                  <th style={{ fontSize: "1rem" }}>마감일</th>
                  <th style={{ fontSize: "1rem" }}>우선순위</th>
                  <th style={{ fontSize: "1rem" }}>진행도</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan="6">업무 데이터가 없습니다.</td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.taskPkNum}>
                      <td style={{ fontWeight: "bold", fontSize: "1rem" }}>
                        {task.taskTitle}
                      </td>
                      <td style={{ fontSize: "1rem" }}>{task.taskStatus}</td>
                      <td style={{ fontSize: "1rem" }}>
                        {dateForm(task.taskStartdate)}
                      </td>
                      <td style={{ fontSize: "1rem" }}>
                        {dateForm(task.taskDeadline)}
                      </td>
                      <td style={{ fontSize: "1rem" }}>
                        {task.taskPriority || "미지정"}
                      </td>
                      <td
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Progress
                          value={Number(task.taskProgress)}
                          max={100}
                          style={{ height: "8px", width: "100%" }}
                        />
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#A0A0A0",
                            marginTop: "3px",
                            textAlign: "center",
                          }}
                        >
                          {`진행률: ${task.taskProgress || 0}%`}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
