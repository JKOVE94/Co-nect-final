import React, { useState } from 'react';
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
import { useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../api/axiosInstance";

const TaskCreate = () => {
    const navigate = useNavigate();
    const [users] = useState([
        { user_num: 1, user_name: "User 1" },
        { user_num: 2, user_name: "User 2" },
    ]);

    const [formData, setFormData] = useState({
        task_title: '',
        task_content: '',
        task_status: '예정',
        task_startdate: '',
        task_deadline: '',
        task_priority: '보통',
        task_fk_user_num: '',
        task_progress: '0%'
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
            const response = await axiosInstance.post('/api/tasks', formData);
            if (response.status === 201) {
                navigate('/tasks');
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const progressOptions = ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'];


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
                    <h2 className="mb-0">업무수정</h2>
                </CardHeader>
                <Form onSubmit={handleSubmit} style={styles.form}>
                    <FormGroup row>
                        <Label
                            sm={2}
                            style={styles.formLabel}
                            for="task_title"
                        >
                            제목 :
                        </Label>
                        <Col sm={10}>
                            <Input
                                id="task_title"
                                type="text"
                                name="task_title"
                                value={formData.task_title}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </FormGroup>

                    <FormGroup row>
                        <Label
                            sm={2}
                            style={styles.formLabel}
                            for="task_content"
                        >
                            내용 :
                        </Label>
                        <Col sm={10}>
                            <Input
                                id="task_content"
                                type="textarea"
                                name="task_content"
                                value={formData.task_content}
                                onChange={handleInputChange}
                                style={styles.textarea}
                                required
                            />
                        </Col>
                    </FormGroup>

                    <Row>
                        <Col sm={6}>
                            <FormGroup row>
                                <Label
                                    sm={4}
                                    style={styles.formLabel}
                                    for="task_status"
                                >
                                    상태 :
                                </Label>
                                <Col sm={8}>
                                    <Input
                                        id="task_status"
                                        type="select"
                                        name="task_status"
                                        value={formData.task_status}
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
                            <FormGroup row>
                                <Label
                                    sm={4}
                                    style={styles.formLabel}
                                    for="task_startdate"
                                >
                                    시작일 :
                                </Label>
                                <Col sm={8}>
                                    <Input
                                        id="task_startdate"
                                        type="date"
                                        name="task_startdate"
                                        value={formData.task_startdate}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={6}>
                            <FormGroup row>
                                <Label
                                    sm={4}
                                    style={styles.formLabel}
                                    for="task_priority"
                                >
                                    우선순위 :
                                </Label>
                                <Col sm={8}>
                                    <Input
                                        id="task_priority"
                                        type="select"
                                        name="task_priority"
                                        value={formData.task_priority}
                                        onChange={handleInputChange}
                                    >
                                        <option value="낮음">낮음</option>
                                        <option value="보통">보통</option>
                                        <option value="높음">높음</option>
                                    </Input>
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup row>
                                <Label
                                    sm={4}
                                    style={styles.formLabel}
                                    for="task_deadline"
                                >
                                    완료일 :
                                </Label>
                                <Col sm={8}>
                                    <Input
                                        id="task_deadline"
                                        type="date"
                                        name="task_deadline"
                                        value={formData.task_deadline}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm={6}>
                            <FormGroup row>
                                <Label
                                    sm={4}
                                    style={styles.formLabel}
                                    for="task_fk_user_num"
                                >
                                    담당자 :
                                </Label>
                                <Col sm={8}>
                                    <Input
                                        id="task_fk_user_num"
                                        type="select"
                                        name="task_fk_user_num"
                                        value={formData.task_fk_user_num}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">담당자 선택</option>
                                        {users.map(user => (
                                            <option
                                                key={user.user_num}
                                                value={user.user_num.toString()}
                                            >
                                                {user.user_name}
                                            </option>
                                        ))}
                                    </Input>
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col sm={6}>
                            <FormGroup row>
                                <Label
                                    sm={4}
                                    style={styles.formLabel}
                                    for="task_progress"
                                >
                                    진행도 :
                                </Label>
                                <Col sm={8}>
                                    <Input
                                        id="task_progress"
                                        type="select"
                                        name="task_progress"
                                        value={formData.task_progress}
                                        onChange={handleInputChange}
                                    >
                                        {progressOptions.map(option => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </Input>
                                </Col>
                            </FormGroup>
                        </Col>
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