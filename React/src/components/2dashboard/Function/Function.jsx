import MyCalendar from "./MyCalendar";
import MySchedule from "./MySchedule";
import axios from "axios";
import { Card, CardBody, Container, Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CalendarToast from "variables/Toast/CalendarToast";
import "../../../assets/css/2dashboard/function.css";
import style from "../../../assets/css/2dashboard/calendar.module.css";

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
        let projEvent = res.data.proj.map((data) => ({
          id: data.proj_pk_num,
          title: data.proj_name,
          start: data.proj_startdate,
          end: data.proj_enddate,
          content: data.proj_desc,
          starttime: data.proj_startdate,
          endtime: data.proj_enddate,
          groupId: 0,
          color: data.proj_tagcol,
          editable: false,
        }));

        let todoEvent = res.data.todo.map((data) => ({
          id: data.todo_pk_num,
          title: data.todo_title,
          start: data.todo_start,
          end: data.todo_end,
          content: data.todo_content,
          starttime: data.todo_start,
          endtime: data.todo_end,
          color: data.todo_tagcol,
          allDay: true,
        }));
        setEvents([...projEvent, ...todoEvent]);
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
          <Col md={8} className="px-0" style={{marginTop: "2rem"}}>
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
          <Col md={4} style={{ marginTop: "2rem" }}>
            <Card className={style.card2}>
              <CardBody className={style.cardbody}>
                <MySchedule events={events} />
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
