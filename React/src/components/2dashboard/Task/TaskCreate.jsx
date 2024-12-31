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
import { format } from "date-fns";

const TaskCreate = () => {
  const navigate = useNavigate();
  const { projectNum } = useParams(); // 프로젝트 번호 받아오기
  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userPkNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호
  const tagOptions = ["red", "orange", "blue", "gray", "green", "gold"];
  const [users, setUsers] = useState([]);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(
          `/conect/${compNum}/task/task/member/${projectNum}`
        );
        // 사용자 데이터 구조를 서버 응답에 맞게 조정
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

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
  });
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // 시작일과 완료일로부터 소요 시간 계산
  useEffect(() => {
    const startdate = new Date(formData.taskStartdate);
    const deadline = new Date(formData.taskDeadline);
    const diffTime = deadline - startdate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDuration(diffDays);
  }, [formData.taskStartdate, formData.taskDeadline]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // taskCreated를 현재 날짜로 설정
      const dataToSend = {
        ...formData,
        taskCreated: format(new Date(), "yyyy-MM-dd"),
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

      navigate(`/main/task/${projectNum}`);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleCancel = () => {
    navigate(-1); // TaskList로 이동
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
          <h2 className="mb-0">업무 생성</h2>
        </CardHeader>
        <Form onSubmit={handleSubmit} style={styles.form}>
          <FormGroup row style={{ height: "auto" }}>
            <Label sm={2} style={styles.formLabel} for="taskTitle">
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

          <FormGroup row style={{ height: "auto" }}>
            <Label sm={2} style={styles.formLabel} for="taskContent">
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
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} for="taskStatus">
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
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} for="taskStartdate">
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
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} for="taskPriority">
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
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} for="taskDeadline">
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
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} for="task_fk_user_num">
                  담당자 :
                </Label>
                <Col sm={8}>
                  <Input
                    id="task_fk_user_num"
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
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} for="taskProgress">
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
            {/* taskDuration 입력 필드 */}
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} for="taskDuration">
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

            {/* taskTagcol 입력 필드 */}
            <Col sm={6}>
              <FormGroup row style={{ height: "auto" }}>
                <Label sm={4} style={styles.formLabel} for="taskTagcol">
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

          {/* taskCreated, taskDepth는 사용자에게는 숨김 처리 */}
          <Input
            type="hidden"
            name="taskCreated"
            value={formData.taskCreated}
          />
          <Input type="hidden" name="taskDepth" value={formData.taskDepth} />
          <Input type="hidden" name="taskGroup" value={formData.taskGroup} />

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

export default TaskCreate;
