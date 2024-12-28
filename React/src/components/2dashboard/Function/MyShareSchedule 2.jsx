import moment from "moment";
import { useEffect, useState } from "react";
import { Accordion, Card, Carousel } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../../../assets/css/2dashboard/function.css";
import style from "../../../assets/css/2dashboard/calendar.module.css";

const MyShareSchedule = ({ events }) => {
  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const num = userInfo.user_pk_num; //사번
  const compPkNum = userInfo.user_fk_comp_num; //회사번호
  const [data, setData] = useState([{}]);

  useEffect(() => {
    const shareData = events.filter(
      (event) =>
        event.sharer !== num &&
        moment(event.end).endOf("day") > moment(new Date()).endOf("day")
    );
    setData(shareData);
  }, [events, num]);

  return (
    <>
      <Card.Title className={style.title}>공유된 일정</Card.Title>
      <Card.Body>
        <ul className={style.ul}>
          {data.length === 0 ? (
            <Card.Subtitle className={style.scheduleSub}>
              공유된 일정이 없습니다.
            </Card.Subtitle>
          ) : (
            data.map((d, iedex) => (
              <li key={iedex}>
                <b>{d.title}</b>
                <br />
                <small>
                  {moment(d.start).format("YY-MM-DD HH:mm")} ~{" "}
                  {moment(d.end).format("YY-MM-DD HH:mm")}
                </small>
              </li>
            ))
          )}
        </ul>
      </Card.Body>
    </>
  );
};
export default MyShareSchedule;
