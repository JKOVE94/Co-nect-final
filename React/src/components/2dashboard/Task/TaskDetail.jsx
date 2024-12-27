import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import {
    Card,
    CardBody,
    CardHeader,
    Container,
    Spinner,
    Alert,
    Row,
    Col,
} from "reactstrap";

const TaskDetail = () => {
    const { taskPkNum } = useParams(); // 태스크 ID를 URL 파라미터에서 가져옴
    const navigate = useNavigate();
    const [task, setTask] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await axiosInstance.get(`/board/task/${taskPkNum}`);
                setTask(response.data[0]);
                console.log(response.data);
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

    return (
        <Container fluid style={{ height: "40em", marginTop: "2em" }}>
            <Row style={{ height: "auto" }}>
                <Col>
                    <Card style={{ height: "auto", overflowY: "auto" }}>
                        <CardHeader>
                            <h2>태스크 상세보기</h2>
                        </CardHeader>
                        <CardBody style={{ fontSize: "1.2rem", padding: "0" }}>
                            <table className="table" style={{ fontSize: "1.2rem" }}>
                                {task ? (
                                    <tbody>
                                    <tr>
                                        <td style={{ width: "10%", textAlign: "left" }}>제 목</td>
                                        <td style={{ width: "90%", textAlign: "left" }}>
                                            {task.taskTitle}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: "10%", textAlign: "left" }}>상 태</td>
                                        <td style={{ width: "90%", textAlign: "left" }}>
                                            {task.taskStatus}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: "10%", textAlign: "left" }}>
                                            작 성 일
                                        </td>
                                        <td style={{ width: "90%", textAlign: "left" }}>
                                            {formatDate(task.taskCreated)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: "10%", textAlign: "left" }}>
                                            시작일
                                        </td>
                                        <td style={{ width: "90%", textAlign: "left" }}>
                                            {formatDate(task.taskStartdate)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: "10%", textAlign: "left" }}>
                                            마감일
                                        </td>
                                        <td style={{ width: "90%", textAlign: "left" }}>
                                            {formatDate(task.taskDeadline)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: "10%", textAlign: "left" }}>
                                            진행도
                                        </td>
                                        <td style={{ width: "90%", textAlign: "left" }}>
                                            {task.taskProgress}%
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ width: "10%", textAlign: "left" }}>내 용</td>
                                        <td style={{ width: "90%", textAlign: "left" }}>
                                            {task.taskContent}
                                        </td>
                                    </tr>
                                    </tbody>
                                ) : (
                                    <div>태스크를 찾을 수 없습니다.</div>
                                )}
                                {/* 버튼들 */}
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "right" }}>
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
                            </table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TaskDetail;