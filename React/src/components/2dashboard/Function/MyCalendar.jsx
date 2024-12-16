import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import CalEventShowModal from "../../../variables/Modal/CalEventShowModal";
import CalEventAddModal from "../../../variables/Modal/CalEventAddModal";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CalEventEditModal from "variables/Modal/CalEventEditModal";

const MyCalendar = ({ events, handleGetEvent, handleToast }) => {

  const [showModalIsOpen, setShowModalIsOpen] = useState(false); //상세보기 modal
  const [addModalIsOpen, setAddModalIsOpen] = useState(false); //이벤트추가 modal
  const [editModalIsOpen, setEditModalIsOpen] = useState(false); //이벤트수정 modal

  const [modalContent, setModalContent] = useState({}); //modal 내용
  
  const num = useSelector((state) => state.userData.user_pk_num); //로그인한 유저의 사번
  const navigate = useNavigate();

  const renderEventContent = (info) => {
    //표시될 타이틀
    //공유된 일정인 경우 타이틀에 [공유] 표기
    return (
      <div>
        {info.event.extendedProps.sharer !== num ?
        <span>[공유] {info.event.title}</span>
        :<span>{info.event.title}</span>
      }
      </div>
    );
  };

  const handleEventClick = (info) => {
    console.log(info);
    setModalContent({
      //modal에 표시될 내용
      title: info.event.title, //제목
      content: info.event.extendedProps.content, //내용
      startdate: moment(info.event._instance.range.start).format("YYYY-MM-DD"), //시작일
      enddate: moment(info.event._instance.range.end).format("YYYY-MM-DD"), //종료일
      starttime : moment(info.event._instance.range.start).format("HH:mm"), //시작시간
      endtime : moment(info.event._instance.range.end).format("HH:mm"), //종료시간
      category : info.event.extendedProps.category,
      all : info.event.extendedProps.all,
      id: info.event.id, //일정 pk num
      sharer:info.event.extendedProps.sharer, //일정 작성자(공유자)
      shared:info.event.extendedProps.shared, //일정 공유된 사람 목록
    });

    if(info.event.extendedProps.sharer === num){
      setEditModalIsOpen(true);
    } else {
      setShowModalIsOpen(true);
    }

  };

  const handleAdd = () => {
    //일정 추가 버튼 클릭 시 모달 열기
    setAddModalIsOpen(true);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth" // 월별 보기
        locale="ko"
        timeZone="Asia/Seoul"
        dayMaxEventRows={3}
        height='auto'
        headerToolbar={{
          start: "today", //오늘날짜, 이전달, 다음달 버튼
          center: "title", //현재 달
          end: "addButton", //커스텀 버튼(일정 추가)
        }}
        footerToolbar={{
          start: "prev,next",
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
      />

      <CalEventShowModal
        isOpen={showModalIsOpen}
        onClose={() => setShowModalIsOpen(false)}
        getEvent={handleGetEvent}
        info={modalContent}
        handleToast={handleToast}
      />

      <CalEventEditModal
        isOpen={editModalIsOpen}
        onClose={() => setEditModalIsOpen(false)}
        getEvent={handleGetEvent}
        info={modalContent}
        handleToast={handleToast}
      />

      <CalEventAddModal
        isOpen={addModalIsOpen}
        onClose={() => setAddModalIsOpen(false)}
        getEvent={handleGetEvent}
        handleToast={handleToast}
      />

    </>
  );
};
export default MyCalendar;
