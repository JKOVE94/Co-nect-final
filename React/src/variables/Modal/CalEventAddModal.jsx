import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import style from '../../assets/css/2dashboard/calendar.module.css'

const CalEventAddModal = ({ isOpen, onClose, getEvent, handleToast }) => {
  const num = useSelector((state) =>  state.userData.user_pk_num); // 로그인한 유저 넘버
  const [data, setData] = useState(); //전달할 데이터
  const [color, setColor] = useState("#318AAE");

  useEffect(() => {
    setData((pre) => ({ ...pre, todo_fk_user_num: num }));
  }, [num]);

  const handleChange = (e) => {
    if (e.target.id === "todo_tagcol") setColor(e.target.value);
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleClick = () => {
    axios
      .post("/function/schedule", data)
      .then((res) => {
        if (res.data) {
          handleToast("add", true);
          getEvent();
        }
      })
      .catch((err) => navigator(`/error`));
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title style={{ display: "flex", alignItems: "center", width:'100%'}}>
          <Col md='100%' style={{fontSize:'1.5rem'}}>일정 추가</Col>
          <Col md={5}>
            <Form.Control
              type="color"
              id="todo_tagcol"
              value={color}
              onChange={handleChange}
              style={{width:'45px'}}
            />
          </Col>
          <Button
            className={style.modalCloseBtn}
            variant="link"
            onClick={onClose}
          >
            &times;
          </Button>
        </Modal.Title>
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
export default CalEventAddModal;
