import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { Badge, Card, Carousel, Col } from "react-bootstrap";
import "../../../assets/css/2dashboard/function.css";
import style from "../../../assets/css/2dashboard/calendar.module.css";

const MySchedule = ({ events }) => {
  const [todoList, setTodoList] = useState([]);
  const [today] = useState(new Date());
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const day = moment(today).utc().startOf("day");

    let dbList = [];
    events.forEach((event) => {
      const sday = moment(event.start).utc().startOf("day");
      const eday = moment(event.end).utc().endOf("day");

      // console.log(sday, eday, day);

      if (sday <= day && day <= eday) {
        dbList.push({
          title: event.title,
          content: event.content,
          start:
            moment(today).utc().startOf("day") > sday
              ? moment().format("00:00 A")
              : moment(event.start).utc().format("hh:mm A"),
          end:
            eday > moment(today).utc().endOf("day")
              ? moment().format("11:59 A")
              : moment(event.end).utc().format("hh:mm A"),
        });
      }
    });
    setTodoList(dbList);
  }, [events]);

  const handlePrev = () => {
    const num = index - 1;
    setIndex(num);
  };
  const handleNext = () => {
    const num = index + 1;
    setIndex(num);
  };

  return (
    <>
      <Card.Title className={style.title}>오늘의 일정</Card.Title>
      <Card.Body className="d-flex align-items-center justify-content-center">
        <Col md={1} style={{ padding: "0", color: "white" }}>
          <Badge bg="secondary" className={style.badge} onClick={handlePrev}>
            {index > 0 ? "<" : ""}
          </Badge>
        </Col>
        {todoList.length === 0 ? (
          <Card.Subtitle className={style.scheduleSub}>
            오늘의 일정이 없습니다.
          </Card.Subtitle>
        ) : (
          <Col md={"auto"}>
            <Carousel
              slide={false}
              data-bs-theme="dark"
              indicators={false}
              interval={null}
              controls={false}
              activeIndex={index}
              onSelect={(e) => {
                setIndex(e);
                // console.log(e);
              }}
            >
              {todoList.map((todo, index) => (
                <Carousel.Item key={index} className={style.itembox}>
                  <Card.Title className={style.subtitle}>
                    {todo.title}
                  </Card.Title>
                  <Card.Subtitle className={style.sub}>
                    {todo.start} ~ {todo.end}
                  </Card.Subtitle>
                  <Card.Text className={style.item}>{todo.content}</Card.Text>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        )}
        <Col md={1} style={{ padding: "0", color: "white" }}>
          <Badge
            big
            bg="secondary"
            className={style.badge}
            onClick={handleNext}
          >
            {index < todoList.length - 1 ? ">" : ""}
          </Badge>
        </Col>
      </Card.Body>
    </>
  );
};
export default MySchedule;
