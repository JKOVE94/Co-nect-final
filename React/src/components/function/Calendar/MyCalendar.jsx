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

const MyCalendar = () => {
  const [type, setType] = useState();
  const [toastIsOpen, setToastIsOpen] = useState(false);
  const [showModalIsOpen, setShowModalIsOpen] = useState(false); //modal 표시 여부
  const [modalContent, setModalContent] = useState({}); //modal 내용
  const [addModalIsOpen, setAddModalIsOpen] = useState(false); //이벤트 추가 modal 표시 여부
  const [events, setEvents] = useState([{}]); //캘린더에 표시될 이벤트

  const num = useSelector((state) => state.usernum); //로그인한 유저의 사번
  const navigate = useNavigate();

  useEffect(() => {
    handleGetEvent();
  }, [num]);

  const setTime = (time) => {
    //시간 설정
    time = moment.utc(time).format("YYYY-MM-DDTHH:mm");
    return time;
  };
    const handleToast = (text, open) => {
        setType(text);
        setToastIsOpen(open);
    }
  const handleGetEvent = async () => {
    //캘린더에 표시될 이벤트 불러오기
    axios
      .get("/function/schedule/" + num)
      .then((res) => {
        let projEvent = res.data.proj.map((data) => ({
          id: data.proj_pk_num,
          title: data.proj_name,
          start: data.proj_startdate,
          end: data.proj_enddate,
          content: data.proj_desc,
          groupId: 0,
          color: data.proj_tagcol,
          editable: false,
        }));

        let todoEvent = res.data.todo.map((data) => ({
          id: data.todo_pk_num,
          title: data.todo_title,
          start: data.todo_start,
          end: data.todo_end,
          content: data.todo_content,
          starttime: data.todo_start,
          endtime: data.todo_end,
          color: "#rgba(49, 138, 174, 0.5)",
          allDay: true,
        }));
        setEvents([...projEvent, ...todoEvent]);
      })
      .catch((err) => {
        const errMsg = "서버 응답 실패";
        navigator(`/error?msg=${errMsg}`);
      });
  };

  const renderEventContent = (eventinfo) => {
    //표시될 타이틀
    return (
      <div className="eventStyle">
        <span>{eventinfo.event.title}</span>
      </div>
    );
  };

  const handleEventClick = (eventinfo) => {
    //이벤트 클릭시 modal 열기
    setModalContent({
      //modal에 표시될 내용
      title: eventinfo.event._def.title,
      content: eventinfo.event._def.extendedProps.content,
      start: setTime(eventinfo.event._def.extendedProps.starttime),
      end: setTime(eventinfo.event._def.extendedProps.endtime),
      groupId: eventinfo.event._def.groupId,
      id: eventinfo.event._def.publicId,
    });
    setShowModalIsOpen(true);
  };

  const handleEventChange = async (eventinfo) => {
    const data = {
      todo_fk_user_num: num,
      todo_title: eventinfo.event._def.title,
      todo_content: eventinfo.event._def.extendedProps.content,
      todo_start: setTime(eventinfo.event._instance.range.start),
      todo_end: setTime(eventinfo.event._instance.range.end),
    };

    axios
      .put("/function/schedule/" + eventinfo.event._def.publicId, data)
      .then((res) => {
        if (res.data.isSuccess) {
          handleGetEvent();
          handleToast("update",true);
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
        type={type}
      />
    </>
  );
};
export default MyCalendar;
