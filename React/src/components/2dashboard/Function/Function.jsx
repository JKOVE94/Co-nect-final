import MyCalendar from "./MyCalendar";
import MySchedule from "./MySchedule";
import CalendarToast from "variables/Toast/CalendarToast";
import MyShareSchedule from "./MyShareSchedule";
import ScheduleCategory from "./ScheduleCategory";
import axiosInstance from "api/axiosInstance";
import Error from "./Error";

import { Card, CardBody, Container, Row, Col } from "reactstrap";
import { useEffect, useState } from "react";

import "../../../assets/css/2dashboard/function.css";
import style from "../../../assets/css/2dashboard/calendar.module.css";

import moment from 'moment-timezone';

const Function = () => {
  
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호

  //toast
  const [toastType, setToastType] = useState("");
  const [toastIsOpen, setToastIsOpen] = useState(false);
  //calendar event(일정)
  const [events, setEvents] = useState([{}]);
  const [allEvents, setAllEvents] = useState([{}]);
  //에러
  const [error, setError] = useState();
  const [errorIsOpen, setErrorIsOpen] = useState(false);

  const handleToast = (text, open) => {
    setToastType(text);
    setToastIsOpen(open);
  };

  const handleError = (error, errorIsOpen) => {
    setError(error);
    setErrorIsOpen(errorIsOpen);
  };

  const handleGetEvent = async () => {
    //캘린더에 표시될 이벤트 불러오기
    axiosInstance
      .get(`/conect/${compNum}/function/schedule/${userNum}`)
      .then((res) => {
        let todoEvent = res.data.map((data) => ({
          id: data.todo_pk_num, //일정 pk num
          title: data.todo_title, //일정 제목
          start: data.todo_starttime // 일정 시작
            ? moment.utc(
                data.todo_startdate + " " + data.todo_starttime,
                "YYYY-MM-DD HH:mm:ss"
              ).toISOString()
            : moment.utc(data.todo_startdate,"YYYY-MM-DD").toISOString(),
          end: data.todo_endtime // 일정 종료
            ? moment.utc(
                data.todo_enddate + " " + data.todo_endtime,
                "YYYY-MM-DD HH:mm:ss"
              ).toISOString()
            : moment.utc(data.todo_enddate,"YYYY-MM-DD").endOf("day").toISOString(),
          content: data.todo_content, //일정 내용
          category: data.todo_category, //일정 카테고리
          sharer: data.todo_fk_user_num, //일정 작성자
          shared: data.share_user, //일정 참여자 목록
          all: data.todo_starttime === null ? true : false,
          display: "block",
          backgroundColor:
            data.todo_category === "회의"
              ? "#53A0EC"
              : data.todo_category === "출장"
              ? "#FFCC66"
              : data.todo_category === "개인일정"
              ? "#FF9999"
              : data.todo_category === "기타"
              ? "#9966FF"
              : "#FFF",
        }));
        setEvents([...todoEvent]);
        setAllEvents([...todoEvent]);
        handleError("", false);
      })
      .catch((err) => {
        handleError("일정을 불러올 수 없습니다.", true);
      });
  };

  useEffect(() => {
    handleGetEvent();
  }, []);

  return (
    <>
      <Container fluid className={style.calendar}>
        <Row className="mx-0 align-items-start justify-content-center">
          <Col md={3}>
            <Card className={style.card2}>
              <CardBody className={style.cardbody}>
                <MySchedule events={allEvents} />
              </CardBody>
            </Card>
            <Card className={style.card2}>
              <CardBody className={style.cardbody}>
                <MyShareSchedule events={allEvents} />
              </CardBody>
            </Card>
            <Card className={style.card2}>
              <CardBody className={style.cardbody}>
                <ScheduleCategory events={allEvents} setEvents={setEvents} />
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
                  handleError={handleError}
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
      <Error
        err={error}
        isOpen={errorIsOpen}
        onClose={() => {
          setErrorIsOpen(false);
        }}
      />
    </>
  );
};
export default Function;
