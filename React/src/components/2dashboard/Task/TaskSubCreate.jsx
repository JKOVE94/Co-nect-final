import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Card,
  Row,
  Container,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { format, differenceInDays } from "date-fns";

const TaskSubCreate = ({
  projectNum,
  parentTaskId,
  parentTaskDepth,
  onClose,
  updateRelatedTasks,
}) => {
  const navigate = useNavigate();
  // const { projectNum, parentTaskId } = useParams();
  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userPkNum = userInfo.user_pk_num;
  const compNum = userInfo.user_fk_comp_num;
  const tagOptions = ["red", "orange", "blue", "gray", "green", "gold"];
  const [users, setUsers] = useState([]);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(
          `/conect/${compNum}/task/task/member/${projectNum}`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (projectNum) {
      fetchUsers();
    }
  }, [compNum, projectNum]);

  const [formData, setFormData] = useState({
    taskTitle: "",
    taskContent: "",
    taskStatus: "예정",
    taskStartdate: "",
    taskDeadline: "",
    taskPriority: "중간",
    taskFkUserNum: "",
    taskProgress: 0,
    taskFkProjNum: projectNum,
    taskDepth: 1,
  });

  useEffect(() => {
    const startDate = new Date(formData.taskStartdate);
    const endDate = new Date(formData.taskDeadline);

    if (startDate && endDate && startDate <= endDate) {
      const duration = differenceInDays(endDate, startDate) + 1;
      setDuration(duration);
    } else {
      setDuration(0);
    }
  }, [formData.taskStartdate, formData.taskDeadline]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "taskStartdate" || name === "taskDeadline") {
      const startDate =
        name === "taskStartdate"
          ? new Date(value)
          : new Date(formData.taskStartdate);
      const endDate =
        name === "taskDeadline"
          ? new Date(value)
          : new Date(formData.taskDeadline);

      if (startDate && endDate && startDate <= endDate) {
        const duration = differenceInDays(endDate, startDate) + 1;
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
          taskDuration: duration,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          [name]: value,
          taskDuration: 0,
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        taskProgress: parseInt(formData.taskProgress, 10),
        taskFkUserNum: parseInt(formData.taskFkUserNum, 10),
        taskCreated: format(new Date(), "yyyy-MM-dd"),
        taskGroup: parseInt(parentTaskId, 10),
        taskDepth: parseInt(parentTaskDepth, 10) + 1,
        taskFkProjNum: parseInt(projectNum, 10),
      };

      const response = await axiosInstance.post(
        `/conect/${compNum}/task/insert`,
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        updateRelatedTasks();
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const progressOptions = [
    "0%",
    "10%",
    "20%",
    "30%",
    "40%",
    "50%",
    "60%",
    "70%",
    "80%",
    "90%",
    "100%",
  ];

  const styles = {
    formLabel: {
      marginBottom: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      paddingRight: "1rem",
    },
    card: {
      maxWidth: "1000px",
      margin: "0 auto",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      overflowY: "auto",
    },
    header: {
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #dee2e6",
      padding: "1rem",
    },
    form: {
      padding: "2rem",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      marginTop: "2rem",
    },
    textarea: {
      minHeight: "120px",
      resize: "vertical",
    },
  };

  return (
    <Container className="py-4" style={{ overflowY: "auto" }}>
      <Card style={styles.card}>
        <CardHeader style={styles.header}>
          <h2 className="mb-0">하위 업무 생성</h2>
        </CardHeader>
        <Form onSubmit={handleSubmit} style={styles.form}>
          <FormGroup row style={{ height: "auto" }}>
            <Label sm={2} style={styles.formLabel} htmlFor="taskTitle">
              제목 :
            </Label>
            <Col sm={10}>
              <Input
                id="taskTitle"
                type="text"
                name="taskTitle"
                value={formData.taskTitle}
                onChange={handleInputChange}
                required
              />
            </Col>
          </FormGroup>

          {/* 내용 입력 */}
          <FormGroup row style={{ height: "auto" }}>
            <Label sm={2} style={styles.formLabel} htmlFor="taskContent">
              내용 :
            </Label>
            <Col sm={10}>
              <Input
                id="taskContent"
                type="textarea"
                name="taskContent"
                value={formData.taskContent}
                onChange={handleInputChange}
                style={styles.textarea}
                required
              />
            </Col>
          </FormGroup>

          <Row style={{ height: "auto" }}>
            {/* 상태 선택 */}
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} htmlFor="taskStatus">
                  상태 :
                </Label>
                <Col sm={8}>
                  <Input
                    id="taskStatus"
                    type="select"
                    name="taskStatus"
                    value={formData.taskStatus}
                    onChange={handleInputChange}
                  >
                    <option value="예정">예정</option>
                    <option value="진행중">진행중</option>
                    <option value="완료">완료</option>
                  </Input>
                </Col>
              </FormGroup>
            </Col>

            {/* 시작일 선택 */}
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} htmlFor="taskStartdate">
                  시작일 :
                </Label>
                <Col sm={8}>
                  <Input
                    id="taskStartdate"
                    type="date"
                    name="taskStartdate"
                    value={formData.taskStartdate}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>

          <Row style={{ height: "auto" }}>
            {/* 우선순위 선택 */}
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} htmlFor="taskPriority">
                  우선순위 :
                </Label>
                <Col sm={8}>
                  <Input
                    id="taskPriority"
                    type="select"
                    name="taskPriority"
                    value={formData.taskPriority}
                    onChange={handleInputChange}
                  >
                    <option value="낮음">낮음</option>
                    <option value="중간">중간</option>
                    <option value="높음">높음</option>
                  </Input>
                </Col>
              </FormGroup>
            </Col>

            {/* 완료일 선택 */}
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} htmlFor="taskDeadline">
                  완료일 :
                </Label>
                <Col sm={8}>
                  <Input
                    id="taskDeadline"
                    type="date"
                    name="taskDeadline"
                    value={formData.taskDeadline}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>

          <Row style={{ height: "auto" }}>
            {/* 담당자 선택 */}
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} htmlFor="taskFkUserNum">
                  담당자 :
                </Label>
                <Col sm={8}>
                  <Input
                    id="taskFkUserNum"
                    type="select"
                    name="taskFkUserNum"
                    value={formData.taskFkUserNum}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">담당자 선택</option>
                    {users.length !== 0
                      ? users.map((user) => (
                          <option
                            key={user.projmem_fk_user_num}
                            value={user.projmem_fk_user_num}
                          >
                            {user.projmem_name}
                          </option>
                        ))
                      : ""}
                    <option
                      key={userInfo.user_pk_num}
                      value={userInfo.user_pk_num}
                    >
                      {userInfo.user_name}
                    </option>
                  </Input>
                </Col>
              </FormGroup>
            </Col>

            {/* 진행도 선택 */}
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} htmlFor="taskProgress">
                  진행도 :
                </Label>
                <Col sm={8}>
                  <Input
                    id="taskProgress"
                    type="select"
                    name="taskProgress"
                    value={formData.taskProgress}
                    onChange={handleInputChange}
                  >
                    {progressOptions.map((option) => (
                      <option key={option} value={parseInt(option, 10)}>
                        {option}
                      </option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>
            </Col>
          </Row>

          <Row style={{ height: "auto" }}>
            {/* 소요 시간 */}
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} htmlFor="taskDuration">
                  소요 시간 :
                </Label>
                <Col sm={8}>
                  <Input
                    id="taskDuration"
                    type="text"
                    name="taskDuration"
                    value={isNaN(duration) ? "0" : `${duration}`}
                    readOnly
                  />
                </Col>
              </FormGroup>
            </Col>

            {/* 태그 선택 */}
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} htmlFor="taskTagcol">
                  태그 :
                </Label>
                <Col sm={8}>
                  <Input
                    id="taskTagcol"
                    type="select"
                    name="taskTagcol"
                    value={formData.taskTagcol}
                    onChange={handleInputChange}
                  >
                    <option value="">태그 선택</option>
                    {tagOptions.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </Input>
                </Col>
              </FormGroup>
            </Col>
          </Row>

          {/* 숨김 필드 */}
          <Input
            type="hidden"
            name="taskCreated"
            value={formData.taskCreated}
          />
          <Input type="hidden" name="taskDepth" value={formData.taskDepth} />

          {/* 버튼 */}
          <div style={styles.buttonContainer}>
            <Button color="primary" type="submit" style={{ minWidth: "100px" }}>
              저장
            </Button>
            <Button
              color="secondary"
              onClick={handleCancel}
              style={{ minWidth: "100px" }}
            >
              취소
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default TaskSubCreate;
