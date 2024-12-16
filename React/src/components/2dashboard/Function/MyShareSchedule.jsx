import moment from "moment";
import { useEffect, useState } from "react";
import { Accordion, Card, Carousel } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../../../assets/css/2dashboard/function.css"
import style from '../../../assets/css/2dashboard/calendar.module.css'

const MyShareSchedule = ({ events }) => {
  const num = useSelector((state) => state.userData.user_pk_num); //로그인한 유저의 사번
  const [data, setData] = useState([{}]);

  useEffect(()=>{
    const shareData = events.filter((event) => event.sharer !== num && moment(event.end).endOf("day") > moment(new Date()).endOf("day"));
    setData(shareData);
  },[events, num])

  return (
    <>
      <Card.Title className={style.title}>공유된 일정</Card.Title>
      <Card.Body>
        <ul className={style.ul}>
        {data.length === 0? 
          (<Card.Subtitle className={style.scheduleSub}>공유된 일정이 없습니다.</Card.Subtitle>) 
        : 
        data.map((d, iedex) => (
          <li key={iedex}>
            <b>{d.title}</b><br/> 
            <small>{moment(d.start).format("MM월 DD일 HH:mm")} ~ {moment(d.end).format("MM월 DD일 HH:mm")}</small>
          </li>
        ))}
        </ul>
      </Card.Body>
    </>
  );
};
export default MyShareSchedule;
