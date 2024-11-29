import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Form, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const CalendarModal = ({ isOpen, onClose, getEvent, handleToast }) => {
  const num = useSelector((state) => state.usernum); // 로그인한 유저 넘버
  const [data, setData] = useState({ todo_fk_user_num: num }); // 전달할 데이터

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleClick = () => {
    axios
      .post("/function/schedule", data)
      .then((res) => {
        if (res.data.isSuccess) {
          handleToast("add", true);
          getEvent();
        }
      })
      .catch((err) => navigator(`/error?msg=서버 응답 실패`));
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>일정 추가</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-2">
          <Form.Label>제목</Form.Label>
          <Form.Control type="text" id="todo_title" onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            id="todo_content"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>시작일</Form.Label>
          <Form.Control
            type="datetime-local"
            id="todo_start"
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>종료일</Form.Label>
          <Form.Control
            type="datetime-local"
            id="todo_end"
            onChange={handleChange}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClick}>등록</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default CalendarModal;
