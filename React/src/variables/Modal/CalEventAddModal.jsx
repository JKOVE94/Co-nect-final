import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Form, Modal } from "react-bootstrap";
import style from "../../assets/css/2dashboard/calendar.module.css";
import ReactMention from "variables/mention/ReactMention";
import axiosInstance from "api/axiosInstance";

const CalEventAddModal = ({
  isOpen,
  onClose,
  getEvent,
  handleToast,
  handleError,
}) => {
  const num = useSelector((state) => state.userData.user_pk_num); //사번
  const compNum = useSelector((state) => state.userData.user_fk_comp_num); //회사번호

  const [data, setData] = useState(); //전달할 데이터
  const [allDay, setAllDay] = useState();

  useEffect(() => {
    setData((pre) => ({ ...pre, todo_fk_user_num: num, todo_category:'기타' }));
    setAllDay(false);
  }, [num]);

  useEffect(() => {
    setAllDay(false);
  }, [isOpen]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleMention = (mention) => {
    setData({ ...data, share_user: mention });
  };

  const handleClick = async () => {
    axiosInstance
      .post(`/conect/${compNum}/function/schedule`, data)
      .then((res) => {
        if (res.data) {
          handleToast("add", true);
          getEvent();
        }
        handleError("", false);
      })
      .catch((err) =>
        handleError("일정 등록에 실패하였습니다. 다시 시도해주세요.", true)
      );
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      return;
    }

    handleClick();
  };

  const handleCheck = (e) => {
    setAllDay(e.target.checked);
    if (e.target.checked) {
      setData({ ...data, todo_starttime: null, todo_endtime: null });
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title
          style={{ display: "flex", alignItems: "center", width: "100%" }}
        >
          <Col md="100%" style={{ fontSize: "1.5rem" }}>
            일정 추가
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
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>
              제목
              <small style={{ color: "gray", marginLeft: "0.5rem" }}>
                필수
              </small>
            </Form.Label>
            <Form.Control
              type="text"
              id="todo_title"
              onChange={handleChange}
              required={true}
            />
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
            <Form.Label>
              시작일
              <small style={{ color: "gray", marginLeft: "0.5rem" }}>
                필수
              </small>
            </Form.Label>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Col md={6} style={{ padding: "0" }}>
                <Form.Control
                  type="date"
                  id="todo_startdate"
                  onChange={handleChange}
                  required={true}
                />
              </Col>
              <Col md={5}>
                <Form.Control
                  type="time"
                  id="todo_starttime"
                  onChange={handleChange}
                  hidden={allDay}
                />
              </Col>
            </div>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>
              종료일
              <small style={{ color: "gray", marginLeft: "0.5rem" }}>
                필수
              </small>
            </Form.Label>
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <Col md={6} style={{ padding: "0" }}>
                <Form.Control
                  type="date"
                  id="todo_enddate"
                  onChange={handleChange}
                  required={true}
                />
              </Col>
              <Col md={5}>
                <Form.Control
                  type="time"
                  id="todo_endtime"
                  onChange={handleChange}
                  hidden={allDay}
                />
              </Col>
            </div>
          </Form.Group>
          <Form.Group className="mb-2 d-flex justify-content-start align-items-center">
            <Form.Label>종일</Form.Label>
            <input
              type="checkbox"
              onClick={handleCheck}
              checked={allDay}
              className={style.check}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>카테고리</Form.Label>
            <Form.Select
              className="form-control"
              id="todo_category"
              onChange={handleChange}
            >
              <option hidden>--카테고리 선택--</option>
              <option value="회의">회의</option>
              <option value="출장">출장</option>
              <option value="개인일정">개인일정</option>
              <option value="기타">기타</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>참여자 
              <small style={{ color: "gray", marginLeft: "0.5rem" }}>
                @사원명 또는 @사번으로 멘션해주세요
              </small></Form.Label>
            <ReactMention
              id="share_user"
              onMention={handleMention}
              text="공유할 사람을 입력해주세요"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit">등록</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
export default CalEventAddModal;
