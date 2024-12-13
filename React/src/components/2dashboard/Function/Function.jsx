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

const Function = () => {
  const num = useSelector((state) => state.userData.user_pk_num);
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
          content: data.todo_content, //일정 내용
          start: data.todo_start, //일정 시작일
          end: data.todo_end, //일정 종료일
          starttime: data.todo_start,
          endtime: data.todo_end,
          color: data.todo_tagcol, //일정 색깔
          sharer: data.todo_fk_user_num, //일정 작성자(공유자)
          shared: data.shareUser, //일정 공유된 사람목록
          allDay: true,
          //일정 작성자만 수정 가능하게 설정
          editable : data.todo_fk_user_num === num? true : false
        }));
        setEvents([...todoEvent]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleGetEvent();
  }, [num]);

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
