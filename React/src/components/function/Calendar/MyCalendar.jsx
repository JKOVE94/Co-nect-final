//FullCalendar 관련 라이브러리
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
//Component
import EventShowModal from "./EventShowModal";
import EventAddModal from "./EventAddModal";
//css
import "../../../assets/css/Calendar.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import EventToast from "./EventToast";

const MyCalendar = ({events, handleGetEvent}) => {
  const [toastType, setToastType] = useState("");
  const [toastIsOpen, setToastIsOpen] = useState(false);
  const [showModalIsOpen, setShowModalIsOpen] = useState(false); //modal 표시 여부
  const [modalContent, setModalContent] = useState({}); //modal 내용
  const [addModalIsOpen, setAddModalIsOpen] = useState(false); //이벤트 추가 modal 표시 여부


  const num = useSelector((state) => state.usernum); //로그인한 유저의 사번
  const navigate = useNavigate();
  const setTime = (time) => {
    //시간 설정
    time = moment.utc(time).format("YYYY-MM-DDTHH:mm");
    return time;
  };
  const handleToast = (text, open) => {
    setToastType(text);
    setToastIsOpen(open);
  };

  const renderEventContent = (info) => {
    //표시될 타이틀
    return (
      <div className="eventStyle">
        <span>{info.event.title}</span>
      </div>
    );
  };

  const handleEventClick = (info) => {
    //이벤트 클릭시 modal 열기
    setModalContent({
      //modal에 표시될 내용
      title: info.event.title,
      content: info.event.extendedProps.content,
      start: setTime(info.event.extendedProps.starttime),
      end: setTime(info.event.extendedProps.endtime),
      groupId: info.event.groupId,
      id: info.event.id,
      tagcol: info.event.backgroundColor,
    });
    setShowModalIsOpen(true);
  };

  const handleEventChange = async (info) => {
    const data = {
      todo_fk_user_num: num,
      todo_title: info.event.title,
      todo_content: info.event.extendedProps.content,
      todo_start: setTime(info.event._instance.range.start),
      todo_end: setTime(info.event._instance.range.end),
      todo_tagcol: info.event.backgroundColor,
    };

    axios
      .put("/function/schedule/" + info.event._def.publicId, data)
      .then((res) => {
        if (res.data.isSuccess) {
          handleGetEvent();
          handleToast("update", true);
        }
      })
      .catch((err) => {
        navigator(`/error?msg=서버 응답 실패`);
      });
  };

  const handleAdd = () => {
    //일정 추가 버튼 클릭 시 모달 열기
    setAddModalIsOpen(true);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth" // 월별 보기
        locale="ko"
        editable={true} // 이벤트 수정 가능
        eventResizableFromStart={true}
        dayMaxEvents={true} // 한 셀에 최대 이벤트(more) 표시 여부
        headerToolbar={{
          start: "today prev,next", //오늘날짜, 이전달, 다음달 버튼
          center: "title", //현재 달
          end: "addButton", //커스텀 버튼(일정 추가)
        }}
        footerToolbar={{
          start: "dayGridMonth dayGridWeek",
        }}
        customButtons={{
          addButton: {
            text: "일정추가",
            click: () => {
              handleAdd();
            },
          },
        }}
        events={events} //표시될 이벤트
        eventContent={renderEventContent} //달력에 표시될 내용
        eventClick={handleEventClick} //이벤트 클릭
        eventChange={handleEventChange} //이벤트 드롭 & 리사이즈
      />

      <EventShowModal
        isOpen={showModalIsOpen}
        onClose={() => setShowModalIsOpen(false)}
        getEvent={handleGetEvent}
        info={modalContent}
        handleToast={handleToast}
      />

      <EventAddModal
        isOpen={addModalIsOpen}
        onClose={() => setAddModalIsOpen(false)}
        getEvent={handleGetEvent}
        handleToast={handleToast}
      />

      <EventToast
        isOpen={toastIsOpen}
        onClose={() => setToastIsOpen(false)}
        toastType={toastType}
      />
    </>
  );
};
export default MyCalendar;
