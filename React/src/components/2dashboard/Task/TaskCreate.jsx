import React, { useState, useEffect } from 'react';
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

const TaskCreate = () => {
    const navigate = useNavigate();
    const { projectNum } = useParams();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/user/userlist');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const [formData, setFormData] = useState({
        taskTitle: '',
        taskContent: '',
        taskStatus: '예정',
        taskStartdate: '',
        taskDeadline: '',
        taskPriority: '보통',
        taskFkUserNum: '',
        taskProgress: 0,
        taskFkProjNum: projectNum
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/board/task/insert', formData);
            if (response.status === 201) {
                navigate(`/main/task/tasklist/${projectNum}`);
            }
        } catch (error) {
            console.error('Error creating task:', error);
            // Handle the error, e.g., show an error message to the user
        }
    };

    const handleCancel = () => {
        navigate(`/main/task/tasklist/${projectNum}`);
    };

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
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
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
        <Container className="py-4">
            <Card style={styles.card}>
                <CardHeader style={styles.header}>
                    <h2 className="mb-0">업무 생성</h2>
                </CardHeader>
                <Form onSubmit={handleSubmit} style={styles.form}>
                    <FormGroup row>
                        <Label
                            sm={2}
                            style={styles.formLabel}
                            for="taskTitle"
                        >
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

                    {/* ... other form inputs (taskContent, taskStatus, taskStartdate, etc.) */}

                    <Row>
                        <Col sm={6}>
                            <FormGroup row>
                                <Label
                                    sm={4}
                                    style={styles.formLabel}
                                    for="taskFkUserNum"
                                >
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
                                        {users.map(user => (
                                            <option
                                                key={user.userPkNum}
                                                value={user.userPkNum}
                                            >
                                                {user.userName}
                                            </option>
                                        ))}
                                    </Input>
                                </Col>
                            </FormGroup>
                        </Col>
                        {/* ... other form inputs (taskProgress) */}
                    </Row>

                    <div style={styles.buttonContainer}>
                        <Button
                            color="secondary"
                            onClick={handleCancel}
                            style={{ minWidth: '100px' }}
                        >
                            취소
                        </Button>
                        <Button
                            color="primary"
                            type="submit"
                            style={{ minWidth: '100px' }}
                        >
                            저장
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
};

export default TaskCreate;