import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../assets/css/Calendar.css";

const CalendarModal = ({ isOpen, onClose, info, getEvent, handleToast }) => {
  const num = useSelector((state) => state.usernum);
  const [data, setData] = useState({});
  const [read, setRead] = useState(false); //수정 가능 여부

  useEffect(() => {
    setData({
      todo_fk_user_num: num,
      todo_title: info.title,
      todo_content: info.content,
      todo_start: info.start,
      todo_end: info.end,
    });
    if (info.groupId === "0") {
      setRead(true);
    } else {
      setRead(false);
    }
  }, [info]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleUpdate = () => {
    axios
      .put("/function/schedule/" + info.id, data)
      .then((res) => {
        if (res.data.isSuccess) {
          handleToast("update", true);
          getEvent();
        }
      })
      .catch((err) => navigator(`/error?msg=서버 응답 실패`));
    onClose();
  };

  const handleDelete = () => {
    axios
      .delete("/function/schedule/" + info.id)
      .then((res) => {
        if (res.data.isSuccess) {
          handleToast("del", true);
          getEvent();
        }
      })
      .catch((err) => navigator(`/error?msg=서버 응답 실패`));
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>일정 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-2">
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            id="todo_title"
            value={data.todo_title}
            onChange={handleChange}
            readOnly={read}
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
            readOnly={read}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>시작일</Form.Label>
          <Form.Control
            type="datetime-local"
            id="todo_start"
            value={data.todo_start}
            onChange={handleChange}
            readOnly={read}
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>종료일</Form.Label>
          <Form.Control
            type="datetime-local"
            value={data.todo_end}
            id="todo_end"
            onChange={handleChange}
            readOnly={read}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        {info.groupId === "0" ? (
          <div className="textinfo">프로젝트 일정은 수정할 수 없습니다</div>
        ) : (
          <Button onClick={handleUpdate}>수정</Button>
        )}
        {info.groupId === "0" ? (
          <></>
        ) : (
          <Button onClick={handleDelete}>삭제</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
export default CalendarModal;
