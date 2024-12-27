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
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import { format, differenceInDays } from "date-fns";

const TaskEdit = () => {
    const { taskId } = useParams(); // useParams 훅을 사용하여 URL 파라미터 가져오기
    const navigate = useNavigate();
    const location = useLocation(); // useLocation 훅 추가
    const projectNum = location.state?.projectNum; // state에서 projectNum 가져오기
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        taskTitle: "",
        taskContent: "",
        taskStatus: "예정",
        taskStartdate: "",
        taskDeadline: "",
        taskPriority: "보통",
        taskFkUserNum: "",
        taskProgress: 0,
        taskFkProjNum: "", // projectNum으로 초기화
        taskTagcol: "",
        taskCreated: "", // 생성 날짜 추가
        taskDuration: 0, // 소요 시간 추가
        taskDepth: 0, // 깊이 추가
        taskGroup: 0
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get(`/board/task/${taskId}`);
                const taskData = response.data;
                const usersResponse = await axiosInstance.get(`/board/task/proj/${taskData.taskFkProjNum}`);
                const uniqueUsers = usersResponse.data.reduce((acc, task) => {
                    if (task.taskFkUserNum && task.userName &&
                        !acc.some(user => user.user_pk_num === task.taskFkUserNum)) {
                        acc.push({
                            user_pk_num: task.taskFkUserNum,
                            user_name: task.userName
                        });
                    }
                    return acc;
                }, []);
                setUsers(uniqueUsers);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        if (taskId) {
            fetchUsers();
        }
    }, [taskId]);

    // task 데이터 가져오기
    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axiosInstance.get(`/board/task/${taskId}`);
                const taskData = response.data;

                const formatDate = (dateString) => {
                    if (!dateString) return "";
                    return new Date(dateString).toISOString().split("T")[0];
                };

                setFormData({
                    taskTitle: taskData.taskTitle,
                    taskContent: taskData.taskContent,
                    taskStatus: taskData.taskStatus,
                    taskStartdate: formatDate(taskData.taskStartdate),
                    taskDeadline: formatDate(taskData.taskDeadline),
                    taskPriority: taskData.taskPriority,
                    taskFkUserNum: taskData.taskFkUserNum,
                    taskProgress: taskData.taskProgress,
                    taskFkProjNum: taskData.taskFkProjNum,
                    taskTagcol: taskData.taskTagcol || "",
                    taskCreated: taskData.taskCreated, // 생성 날짜 추가
                    taskDuration: taskData.taskDuration || 0, // 소요 시간 추가
                    taskDepth: taskData.taskDepth || 0, // 깊이 추가
                });
            } catch (error) {
                console.error("Error fetching task:", error);
            }
        };

        if (taskId) {
            fetchTask();
        }
    }, [taskId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // taskStartdate와 taskDeadline이 변경될 때 taskDuration을 업데이트
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
            console.log("taskId:", taskId);

            if (!taskId) {
                console.error("taskId is null or undefined");
                return;
            }

            const dataToSend = {
                ...formData,
                taskPkNum: taskId, // 명시적으로 taskPkNum 속성에 taskId 값 할당
            };

            await axiosInstance.put(`/board/task/update/${taskId}`, dataToSend);
            navigate(`/main/task/tasklist/${projectNum}`);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleCancel = () => {
        if (!projectNum) {
            // 프로젝트 번호가 없는 경우 이전 페이지로 이동
            navigate(-1);
            return;
        }
        navigate(`/main/task/${projectNum}`);
    };

    const progressOptions = [
        "0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%",
    ];

    const tagOptions = ["red", "orange", "blue", "gray", "green", "gold"];



    const styles = {
        formLabel: {
            marginBottom: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '1rem'
        },
        card: {
            maxWidth: '1000px',
            margin: '0 auto',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            overflowY: 'auto'
        },
        header: {
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #dee2e6',
            padding: '1rem'
        },
        form: {
            padding: '2rem'
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '2rem'
        },
        textarea: {
            minHeight: '120px',
            resize: 'vertical'
        }
    };

    return (
        <Container className="py-4" style={{ overflowY: "auto" }}>
            <Card style={styles.card}>
                <CardHeader style={styles.header}>
                    <h2 className="mb-0">업무 수정</h2>
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
                                <Label sm={4} style={styles.formLabel} for="taskFkUserNum">
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
                                        {users.map((user) => (
                                            <option key={user.user_pk_num} value={user.user_pk_num}>
                                                {user.user_name}
                                            </option>
                                        ))}
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
                                        value={`${formData.taskDuration}일`}
                                        readOnly
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
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
                    <Input type="hidden" name="taskCreated" value={formData.taskCreated} />
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


export default TaskEdit;
