import moment from "moment";
import { useEffect, useState } from "react";
import { Card, Carousel } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../../../assets/css/2dashboard/function.css"
import style from '../../../assets/css/2dashboard/calendar.module.css'

const MySchedule = ({ events }) => {
  const [todoList, setTodoList] = useState([]);
  const [today] = useState(new Date());

  useEffect(() => {
    const day = moment(today).startOf("day");
    let dbList = [];
    events.forEach((event) => {
      const sday = moment(event.start).startOf("day");
      const eday = moment(event.end).endOf("day");
      if (sday <= day && day <= eday) {
        dbList.push({
          title: event.title,
          content: event.content,
          start: moment(event.start).format("hh:mm A"),
          end:
            eday > moment(today).endOf("day")
              ? moment().format("12:00 A")
              : moment(event.end).format("hh:mm A"),
        });
      }
    });
    setTodoList(dbList);
  }, [events]);

  return (
    <>
      <Card.Title className={style.title}>오늘의 일정</Card.Title>
      <Card.Body>
        {todoList.length === 0 ? (
          <Card.Subtitle className={style.scheduleSub}>오늘의 일정이 없습니다.</Card.Subtitle>
        ) : (
          <Carousel
            slide={false}
            data-bs-theme="dark"
            prevLabel=""
            nextLabel=""
            prevIcon="<"
            nextIcon=">"
            indicators={false}
            interval={null}
          >
            {todoList.map((todo, index) => (
              <Carousel.Item key={index} className={style.itembox}>
                <Card.Title className={style.subtitle}>{todo.title}</Card.Title>
                <Card.Subtitle className={style.sub}>
                  {todo.start} ~ {todo.end}
                </Card.Subtitle>
                <Card.Text className={style.item}>{todo.content}</Card.Text>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </Card.Body>
    </>
  );
};
export default MySchedule;
