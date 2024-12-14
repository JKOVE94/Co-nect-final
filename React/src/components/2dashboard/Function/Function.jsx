import MyCalendar from "./MyCalendar";
import MySchedule from "./MySchedule";
import axios from "axios";
import { Card, CardBody, Container, Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CalendarToast from "variables/Toast/CalendarToast";
import "../../../assets/css/2dashboard/function.css";
import style from "../../../assets/css/2dashboard/calendar.module.css";
import MyShareSchedule from "./MyShareSchedule";
import moment from "moment";

const Function = () => {
  
  const num = useSelector((state) => state.userData.user_pk_num); //로그인한 유저의 사번
    
  //toast
  const [toastType, setToastType] = useState("");
  const [toastIsOpen, setToastIsOpen] = useState(false);
  //calendar event(일정)
  const [events, setEvents] = useState([{}]);

  const handleToast = (text, open) => {
    setToastType(text);
    setToastIsOpen(open);
  };

  const handleGetEvent = async () => {
    //캘린더에 표시될 이벤트 불러오기
    axios
      .get("/function/schedule/" + num)
      .then((res) => {
        let todoEvent = res.data.map((data) => ({
          id: data.todo_pk_num, //일정 pk num
          title: data.todo_title, //일정 제목
          start: data.todo_starttime? // 일정 시작
            moment(data.todo_startdate + ' ' + data.todo_starttime, 'YYYY-MM-DD HH:mm:ss').toISOString():
            moment(data.todo_startdate).startOf('day').toISOString(), 
          end : data.todo_endtime? // 일정 종료
            moment(data.todo_enddate + ' ' + data.todo_endtime, 'YYYY-MM-DD HH:mm:ss').toISOString():
            moment(data.todo_enddate).endOf('day').toISOString(), 
          content: data.todo_content, //일정 내용
          category : data.todo_category, //일정 카테고리
          sharer: data.todo_fk_user_num, //일정 작성자
          shared: data.shareList, //일정 참여자 목록
          backgroundColor : data.todo_category === "회의" ? "#53A0EC" : 
            data.todo_category === "출장" ? "#FFCC66" :
            data.todo_category === "개인일정" ? "#FF9999" :
            data.todo_category === "기타" ? "#9966FF" : "#FFF"
  }));
        setEvents([...todoEvent]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleGetEvent();
  }, []);

  return (
    <>
      <Container fluid className={style.calendar}>
        <Row className="mx-0 align-items-start justify-content-center">
          <Col md={4} >
            <Card className={style.card2}>
              <CardBody className={style.cardbody}>
                <MySchedule events={events} />
              </CardBody>
            </Card>
            <Card className={style.card2}>
              <CardBody className={style.cardbody}>
                <MyShareSchedule events={events} />
              </CardBody>
            </Card>
          </Col>
          <Col md={8} className="px-0">
            <Card className="mx-auto">
              <CardBody
                className="p-10"
                style={{ maxHeight: "45em", overflowY: "auto" }}
              >
                <MyCalendar
                  events={events}
                  handleGetEvent={handleGetEvent}
                  handleToast={handleToast}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div className={style.toastContainer}>
          <CalendarToast
            isOpen={toastIsOpen}
            onClose={() => setToastIsOpen(false)}
            toastType={toastType}
          />
        </div>
      </Container>
    </>
  );
};
export default Function;
