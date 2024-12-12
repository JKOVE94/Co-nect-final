import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Modal, Button, Row, Col, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import style from '../../assets/css/2dashboard/calendar.module.css'
import ReactMention from "variables/mention/ReactMention";

const CalEventEditModal = ({
  isOpen,
  onClose,
  info,
  getEvent,
  handleToast
}) => {
  const num = useSelector((state) => state.userData.user_pk_num);
  const [data, setData] = useState({});
  const [read, setRead] = useState(); //수정 가능 여부

  useEffect(() => {
    setData({
      todo_fk_user_num: num,
      todo_title: info.title || "",
      todo_content: info.content || "",
      todo_start: info.start || "",
      todo_end: info.end || "",
      todo_tagcol: info.tagcol || "#000000",
      shareUser:info.shared || ""
    });
    setRead(true);
  }, [isOpen, onClose, info, getEvent, handleToast, num]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleUpdateForm = () => {
    setRead(false);
  };

  const handleMention = (mention) => {
    let str = mention.join(",");
    setData({...data,shareUser:str});
  }

  const handleUpdate = () => {
    axios
      .put("/function/schedule/" + info.id, data)
      .then((res) => {
        if (res.data) {
          handleToast("update", true);
          getEvent();
        }
      })
      .catch((err) => navigator(`/error`));
    onClose();
  };

  const handleDelete = () => {
    axios
      .delete("/function/schedule/" + info.id)
      .then((res) => {
        if (res.data) {
          handleToast("del", true);
          getEvent();
        }
      })
      .catch((err) => navigator(`/error`));
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title style={{ display: "flex", alignItems: "center", width:'100%' }}>
          <Col md='100%' style={{fontSize:'1.5rem'}}>일정 수정</Col>
          <Col md={5}>
            <Form.Control
              value={data.todo_tagcol}
              type="color"
              id="todo_tagcol"
              onChange={handleChange}
              style={{width:'45px'}}
              disabled={read}
            />
          </Col>
          <Button className={style.modalCloseBtn} variant="link" onClick={onClose}>
            &times;
          </Button>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-2">
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            id="todo_title"
            value={data.todo_title}
            onChange={handleChange}
            disabled={read}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            id="todo_content"
            value={data.todo_content}
            onChange={handleChange}
            disabled={read}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>시작일</Form.Label>
          <Form.Control
            type="datetime-local"
            id="todo_start"
            value={data.todo_start}
            onChange={handleChange}
            disabled={read}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>종료일</Form.Label>
          <Form.Control
            type="datetime-local"
            value={data.todo_end}
            id="todo_end"
            onChange={handleChange}
            disabled={read}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>참석자</Form.Label>
          <ReactMention
            id="shareUser"
            disabled={read}
            onMention={handleMention}
            userList={info.shared}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <>
          {read ? (
            <Button onClick={handleUpdateForm}>수정</Button>
          ) : (
            <Button onClick={handleUpdate}>수정확인</Button>
          )}
          <Button onClick={handleDelete}>삭제</Button>
        </>
      </Modal.Footer>
    </Modal>
  );
};
export default CalEventEditModal;
