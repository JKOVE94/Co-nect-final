import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Modal, Button, Row, Col, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "../../assets/css/2dashboard/calendar.module.css";
import ReactMention from "variables/mention/ReactMention";

const CalEventShowModal = ({ isOpen, onClose, info }) => {
  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title
          style={{ display: "flex", alignItems: "center", width: "100%" }}
        >
          <Col md="100%" style={{ fontSize: "1.5rem" }}>
            일정 상세
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
          <Form.Control
            type="text"
            id="todo_title"
            value={info.title}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            id="todo_content"
            value={info.content}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>시작일</Form.Label>
          <Form.Control
            type="datetime-local"
            id="todo_start"
            value={info.start}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>종료일</Form.Label>
          <Form.Control
            type="datetime-local"
            value={info.end}
            id="todo_end"
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>공유자</Form.Label>
          <ReactMention id="shareUser" disabled={true} userList={info.sharer} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Container className={style.textinfo}>공유된 일정입니다.</Container>
      </Modal.Footer>
    </Modal>
  );
};
export default CalEventShowModal;
