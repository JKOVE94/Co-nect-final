import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Form, Modal, Button, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "../../assets/css/2dashboard/calendar.module.css";
import ReactMention from "variables/mention/ReactMention";
import axiosInstance from "api/axiosInstance";

const CalEventEditModal = ({
  isOpen,
  onClose,
  info,
  getEvent,
  handleToast,
  handleError,
}) => {
  const num = useSelector((state) => state.userData.user_pk_num); //사번
  const compNum = useSelector((state) => state.userData.user_fk_comp_num); //회사번호

  const [data, setData] = useState({});
  const [read, setRead] = useState(); //수정 가능 여부
  const [users, setUsers] = useState([]);
  const [allDay, setAllDay] = useState();

  useEffect(() => {
    setData({
      todo_fk_user_num: num,
      todo_title: info.title || "",
      todo_content: info.content || "",
      todo_startdate: info.startdate || "",
      todo_enddate: info.enddate || "",
      todo_starttime: info.all ? "" : info.starttime,
      todo_endtime: info.all ? "" : info.endtime,
      todo_category: info.category || "",
      share_user: info.shared || "",
    });
    setRead(true);
    setUsers(info.shared);
    setAllDay(info.all);
  }, [isOpen, onClose, info, getEvent, handleToast, num]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleUpdateForm = (e) => {
    e.preventDefault();
    setRead(false);
    setAllDay(false);
  };

  const handleMention = (mention) => {
    setData({ ...data, share_user: mention });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!e.target.checkValidity()) {
      return;
    }
    handleUpdate();
  };

  const handleUpdate = () => {
    axiosInstance
      .put(`/conect/${compNum}/function/schedule/` + info.id, data)
      .then((res) => {
        if (res.data) {
          handleToast("update", true);
          getEvent();
        }
        handleError("", false);
      })
      .catch((err) =>
        handleError("일정 등록에 실패하였습니다. 다시 시도해주세요.", true)
      );
    onClose();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axiosInstance
      .delete(`/conect/${compNum}/function/schedule/` + info.id)
      .then((res) => {
        if (res.data) {
          handleToast("del", true);
          getEvent();
        }
        handleError("", false);
      })
      .catch((err) => handleError(err.response.data, true));
    onClose();
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
            일정 수정
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
              value={data.todo_title}
              onChange={handleChange}
              disabled={read}
              required={true}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>
              내용
              <small style={{ color: "gray", marginLeft: "0.5rem" }}>
                필수
              </small>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              id="todo_content"
              value={data.todo_content}
              onChange={handleChange}
              disabled={read}
              required={true}
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
                  value={data.todo_startdate}
                  onChange={handleChange}
                  disabled={read}
                  required={true}
                />
              </Col>
              <Col md={5}>
                <Form.Control
                  type="time"
                  id="todo_starttime"
                  value={data.todo_starttime}
                  hidden={allDay}
                  onChange={handleChange}
                  disabled={read}
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
                  value={data.todo_enddate}
                  onChange={handleChange}
                  disabled={read}
                  required={true}
                />
              </Col>
              <Col md={5}>
                <Form.Control
                  type="time"
                  id="todo_endtime"
                  value={data.todo_endtime}
                  onChange={handleChange}
                  hidden={allDay}
                  disabled={read}
                />
              </Col>
            </div>
          </Form.Group>
          <Form.Group
            className="mb-2 justify-content-start align-items-center"
            hidden={read}
          >
            <Form.Label>종일</Form.Label>
            <input
              type="checkbox"
              onClick={handleCheck}
              className={style.check}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>카테고리</Form.Label>
            <Form.Select
              className="form-control"
              id="todo_category"
              value={data.todo_category}
              disabled={read}
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
            {!read && <small style={{ color: "gray", marginLeft: "0.5rem" }}>
                @사원명 또는 @사번으로 멘션해주세요
              </small>}
            </Form.Label>
            <ReactMention
              id="shareUser"
              disabled={read}
              onMention={handleMention}
              userList={users}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <>
            {read ? (
              <Button onClick={handleUpdateForm}>수정</Button>
            ) : (
              <Button type="submit">수정확인</Button>
            )}
            <Button onClick={handleDelete}>삭제</Button>
          </>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
export default CalEventEditModal;
