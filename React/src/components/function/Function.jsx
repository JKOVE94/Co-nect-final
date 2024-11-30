import MyCalendar from "./Calendar/MyCalendar";
import "../../assets/css/Calendar.css";
import MySchedule from "./Schedule/MySchedule";

import { Card, CardBody, Container, Row, Col } from "reactstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Function = () => {
  
  const num = useSelector((state) => state.usernum); 
  const [events, setEvents] = useState([{}]);

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
        const errMsg = "서버 응답 실패";
        navigator(`/error?msg=${errMsg}`);
      });
  };
  
  useEffect(() => {
    handleGetEvent();
  }, [num]);

  return (
    <>
      <Container fluid style={{ marginTop: "2rem" }}>
        <Row className="mx-0 align-items-start">
          <Col xs={8} className="px-0">
            <Card className="mx-auto">
              <CardBody className="p-10">
                <MyCalendar events={events} handleGetEvent={handleGetEvent}/>
              </CardBody>
            </Card>
            </Col>
            <Col xs={4}>
            <Card className="mx-auto">
              <CardBody className="p-10">
                <MySchedule events={events}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Function;
