import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Accordion, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../../../assets/css/Calendar.css";

const MySchedule = ({ events }) => {
  const num = useSelector((state) => state.usernum);
  const [todoList, setTodoList] = useState([]);
  const [today] = useState(new Date());

  useEffect(() => {
    const day = moment(today).startOf('day');
    let dbList = [];
    events.forEach((event) => {
      const sday = moment(event.start).startOf('day');
      const eday = moment(event.end).endOf('day');
      if (sday <= day && day <= eday) {
        dbList.push({
          title: event.title,
          content: event.content,
          start: moment(event.start).format("hh:mm A"),
          end: eday > moment(today).endOf('day') ? moment().format("12:00 A") : moment(event.end).format("hh:mm A"),
        });
      }
    });
    setTodoList(dbList);
  }, [events]);

  return (
    <div>
      <p className="accTitle">오늘의 일정</p>
      <div>
        {todoList.length === 0 ? (
          <>일정이 없습니다.</>
        ) : (
          <Accordion>
            {todoList.map((todo, index) => (
              <Accordion.Item eventKey={index} key={index} className="accItem">
                <Accordion.Header>
                <div className="accHead">{todo.start} ~ {todo.end}<br/><b>{todo.title}</b></div>
                </Accordion.Header>
                <Accordion.Body>{todo.content}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};
export default MySchedule;
