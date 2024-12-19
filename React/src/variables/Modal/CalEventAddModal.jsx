import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Form, Modal } from "react-bootstrap";
import style from '../../assets/css/2dashboard/calendar.module.css'
import ReactMention from "variables/mention/ReactMention";

const CalEventAddModal = ({ isOpen, onClose, getEvent, handleToast }) => {
  const num = useSelector((state) =>  state.userData.user_pk_num); // 로그인한 유저 넘버
  const compNum = JSON.parse(
    sessionStorage.getItem("persist:userInfo")
  ).user_fk_comp_num;
  const [data, setData] = useState(); //전달할 데이터
  const [timeZon, setTimeZon] = useState();

  useEffect(()=>{
    setData((pre) => ({ ...pre, todo_fk_user_num: num}));
  },[num])

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value});
  };

  const handleMention = (mention) => {
    setData({...data,share_user:mention});
  }

  const handleClick = async () => {
    axios
      .post(`/${compNum}/function/schedule`, data)
      .then((res) => {
        if (res.data) {
          handleToast("add", true);
          getEvent();
        }
      })
      .catch((err) => console.log(err));
    onClose();
    console.log(data);
  };

  const handleCheck = (e) => {
    setTimeZon(e.target.checked);
    if(e.target.checked){
      setData({...data, todo_starttime:null, todo_endtime:null})
    }
  }

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title style={{ display: "flex", alignItems: "center", width:'100%'}}>
          <Col md='100%' style={{fontSize:'1.5rem'}}>일정 추가</Col>
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
          <Form.Control type="text" id="todo_title" onChange={handleChange} required/>
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
        <Form.Group className="mb-2" >
          <Form.Label>시작일</Form.Label>
          <div style={{ display: "flex", justifyContent: "flex-start"}}>
            <Col md={6} style={{padding:"0"}}>
              <Form.Control
                type="date"
                id="todo_startdate"
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={5}>
              <Form.Control
                type="time"
                id="todo_starttime"
                onChange={handleChange}
                hidden={timeZon}
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
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={5}>
              <Form.Control
                type="time"
                id="todo_endtime"
                onChange={handleChange}
                hidden={timeZon}
              />
            </Col>
          </div>
        </Form.Group>
        <Form.Group className="mb-2 d-flex justify-content-start align-items-center">
          <Form.Label>종일</Form.Label>
          <input type="checkbox" onClick={handleCheck} className={style.check}/>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>카테고리</Form.Label>
          <Form.Select className="form-control" id="todo_category" onChange={handleChange}>
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
            id="share_user"
            onMention={handleMention}
            text="공유할 사람을 입력해주세요"
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
