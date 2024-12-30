import moment from "moment";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../../../assets/css/2dashboard/function.css";
import style from "../../../assets/css/2dashboard/calendar.module.css";
import CalEventShowModal from "variables/Modal/CalEventShowModal";
import ReactMention from "variables/mention/ReactMention";

const MyShareSchedule = ({ events }) => {
  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const num = userInfo.user_pk_num; //사번
  const compPkNum = userInfo.user_fk_comp_num; //회사번호

  const [data, setData] = useState([{}]);
  const [showModalIsOpen, setShowModalIsOpen] = useState(false); //상세보기 modal

  const [modalContent, setModalContent] = useState({}); //modal 내용

  useEffect(() => {
    const shareData = events.filter((event) => event.sharer !== num && moment(event.end).utc().endOf("day") >= moment(new Date()).utc().endOf("day"))
    .sort((a,b) => moment(a.start).isBefore(moment(b.start)) ? -1 : 1);
    setData(shareData);
  }, [events, num]);


  const handleEventClick = (info) => {
    // console.log(info);
    setModalContent({
      //modal에 표시될 내용
      title: info.title, //제목
      content: info.content, //내용
      startdate: moment(info.start).utc().format("YYYY-MM-DD"), //시작일
      enddate: moment(info.end).utc().format("YYYY-MM-DD"), //종료일
      starttime: moment(info.start).utc().format("HH:mm"), //시작시간
      endtime: moment(info.end).utc().format("HH:mm"), //종료시간
      category: info.category,
      all: info.all,
      id: info.id, //일정 pk num
      sharer: info.sharer, //일정 작성자(공유자)
      shared: info.shared, //일정 공유된 사람 목록
    });

    setShowModalIsOpen(true);
  };

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
              <li
                key={iedex}
                onClick={() => handleEventClick(d)}
                style={{ cursor: "pointer" }}
              >
                <b>{d.title}</b> <br />
                <small>
                  {moment(d.start).utc().format("MM월 DD일 HH:mm")} ~{" "}
                  {moment(d.end).utc().format("MM월 DD일 HH:mm")}
                </small>
              </li>
            ))
          )}
        </ul>
      </Card.Body>
      <CalEventShowModal
        isOpen={showModalIsOpen}
        onClose={() => setShowModalIsOpen(false)}
        info={modalContent}
      />
    </>
  );
};
export default MyShareSchedule;
