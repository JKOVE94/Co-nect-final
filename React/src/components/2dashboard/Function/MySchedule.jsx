import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Accordion, Carousel, Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../../../assets/css/calendar.css";

const MySchedule = ({ events }) => {
  const num = useSelector((state) => state.userData.user_pk_num);
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
    <div>
      <p className="accTitle">오늘의 일정</p>
      <>
        {todoList.length === 0 ? (
          <>일정이 없습니다.</>
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
              <Carousel.Item key={index}>
                <div style={{ textAlign: "center" }}>
                  <h4>{todo.title}</h4>
                  <p>
                    {todo.start} ~ {todo.end}
                  </p>
                  <div className="accItem">{todo.content}</div>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </>
    </div>
  );
};
export default MySchedule;
