import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment-timezone";
import CalEventShowModal from "../../../variables/Modal/CalEventShowModal";
import CalEventAddModal from "../../../variables/Modal/CalEventAddModal";
import { useState } from "react";
import CalEventEditModal from "variables/Modal/CalEventEditModal";

const MyCalendar = ({ events, handleGetEvent, handleToast, handleError }) => {
  const [showModalIsOpen, setShowModalIsOpen] = useState(false); //상세보기 modal
  const [addModalIsOpen, setAddModalIsOpen] = useState(false); //이벤트추가 modal
  const [editModalIsOpen, setEditModalIsOpen] = useState(false); //이벤트수정 modal

  const [modalContent, setModalContent] = useState({}); //modal 내용

  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const num = userInfo.user_pk_num; //사번

  const renderEventContent = (info) => {
    // console.log(info);
    //표시될 타이틀
    //공유된 일정인 경우 타이틀에 [공유] 표기
    return (
      <div>
        {info.event.extendedProps.sharer !== num ? (
          <span>
            {" "}
            {info.event.extendedProps.all ? "" : info.timeText}
            &nbsp; [공유] {info.event.title}
          </span>
        ) : (
          <span>
            {" "}
            {info.event.extendedProps.all ? "" : info.timeText}
            &nbsp; {info.event.title}
          </span>
        )}
      </div>
    );
  };

  const handleEventClick = (info) => {
    const start = moment(info.event.start);
    const end = moment(info.event.end);

    setModalContent({
      //modal에 표시될 내용
      title: info.event.title, //제목
      content: info.event.extendedProps.content, //내용
      startdate: start.clone().utc().format("YYYY-MM-DD"),
      enddate: end.clone().utc().format("YYYY-MM-DD"), //종료일
      starttime: start.clone().utc().format("HH:mm"), //시작시간
      endtime: end.clone().utc().format("HH:mm"), //종료시간
      category: info.event.extendedProps.category,
      all: info.event.extendedProps.all,
      id: info.event.id, //일정 pk num
      sharer: info.event.extendedProps.sharer, //일정 작성자(공유자)
      shared: info.event.extendedProps.shared, //일정 공유된 사람 목록
    });

    if (info.event.extendedProps.sharer === num) {
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
        height="auto"
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
        eventOrder={moment(events.start).format("HH:mm")}
      />

      <CalEventShowModal
        isOpen={showModalIsOpen}
        onClose={() => setShowModalIsOpen(false)}
        info={modalContent}
      />

      <CalEventEditModal
        isOpen={editModalIsOpen}
        onClose={() => setEditModalIsOpen(false)}
        getEvent={handleGetEvent}
        info={modalContent}
        handleToast={handleToast}
        handleError={handleError}
      />

      <CalEventAddModal
        isOpen={addModalIsOpen}
        onClose={() => setAddModalIsOpen(false)}
        getEvent={handleGetEvent}
        handleToast={handleToast}
        handleError={handleError}
      />
    </>
  );
};
export default MyCalendar;
