import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../../../assets/css/Calendar.css"

const MySchedule = () => {
  const num = useSelector((state) => state.usernum);
  const [todoList, setTodoList] = useState([]);
  const [today] = useState(new Date());

  useEffect(() => {
    const day = moment(today).format("YYYY-MM-DD");
    axios
      .get("/function/schedule/" + num)
      .then((res) => {
        let dbList = [];
        res.data.todo.forEach((data) => {
          const sday = moment(data.todo_start).format("YYYY-MM-DD");
          const eday = moment(data.todo_end).format("YYYY-MM-DD");
          if (sday <= day && day <= eday) {
            dbList.push({ title: data.todo_title, 
                content: data.todo_content,
                start : moment(data.todo_start).format('hh:mm'),
                end : moment(data.todo_end).format('hh:mm')     });
          }
        });
        res.data.proj.forEach((data) => {
          const sday = moment(data.proj_startdate).format("YYYY-MM-DD");
          const eday = moment(data.proj_enddate).format("YYYY-MM-DD");
          if (sday <= day && day <= eday) {
            dbList.push({ title: data.proj_name, content: data.proj_desc,
                start : moment(data.proj_startdate).format('hh:mm:ss'),
                end : moment(data.proj_enddate).format('hh:mm:ss')     });
          }
        });
        setTodoList(dbList);
      })
      .catch();
  }, [num, today]);

  return (
    <div>
      <p className="accTitle">오늘의 일정</p>
      <div>
        {!todoList[0] && <>일정이 없습니다.</>}
        <Accordion>
          {todoList.map((todo, index) => (
            <Accordion.Item eventKey={index}>
              <Accordion.Header>{todo.start} ~ {todo.end}&nbsp;<b>{todo.title}</b></Accordion.Header>
              <Accordion.Body>{todo.content}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
export default MySchedule;
