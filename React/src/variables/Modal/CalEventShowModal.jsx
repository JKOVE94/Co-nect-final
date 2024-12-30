import { Form, Modal, Button, Row, Col, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import style from '../../assets/css/2dashboard/calendar.module.css'
import ReactMention from "variables/mention/ReactMention";

const CalEventShowModal = ({
  isOpen,
  onClose,
  info
}) => {

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title style={{ display: "flex", alignItems: "center", width:'100%' }}>
          <Col md='100%' style={{fontSize:'1.5rem'}}>일정 상세</Col>
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
        <Form.Group className="mb-2" >
          <Form.Label>시작일</Form.Label>
          <div style={{ display: "flex", justifyContent: "flex-start"}}>
            <Col md={6} style={{padding:"0"}}>
              <Form.Control
                type="date"
                id="todo_startdate"
                value={info.startdate}
                disabled
              />
            </Col>
            <Col md={5}>
              <Form.Control
                type="time"
                id="todo_starttime"
                value={info.starttime}
                disabled
                hidden={info.all}
              />
            </Col>
          </div>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>종료일</Form.Label>
          <div style={{ display: "flex", justifyContent: "flex-start"}}>
            <Col md={6} style={{padding:"0"}}>
              <Form.Control
                type="date"
                id="todo_enddate"
                value={info.enddate}
                disabled
              />
            </Col>
            <Col md={5}>
              <Form.Control
                type="time"
                id="todo_endtime"
                value={info.endtime}
                hidden={info.all}
                disabled
              />
            </Col>
          </div>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>카테고리</Form.Label>
          <Form.Select className="form-control" id="todo_category" value={info.category} disabled>
            <option hidden>--카테고리 선택--</option>
            <option value="회의">회의</option>
            <option value="출장">출장</option>
            <option value="개인일정">개인일정</option>
            <option value="기타">기타</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>참여자</Form.Label>
          <ReactMention
            id="shareUser"
            disabled={true}
            userList={info.shared && [...info.shared, info.sharer]}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Container className={style.textinfo}>
          공유된 일정입니다.
        </Container>
      </Modal.Footer>
    </Modal>
  );
};
export default CalEventShowModal;
