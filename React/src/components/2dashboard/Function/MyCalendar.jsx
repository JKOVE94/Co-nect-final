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

  const setTime = (time) => {
    //시간 설정
    time = moment(time).format("YYYY-MM-DDTHH:mm");
    return time;
  };

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
    setModalContent({
      //modal에 표시될 내용
      title: info.event.title, //제목
      content: info.event.extendedProps.content, //내용
      start: setTime(info.event.extendedProps.starttime), //시작일
      end: setTime(info.event.extendedProps.endtime), //종료일
      id: info.event.id, //일정 pk num
      sharer:info.event.extendedProps.sharer.toString(), //일정 작성자(공유자)
      shared:info.event.extendedProps.shared, //일정 공유된 사람 목록
      tagcol: info.event.backgroundColor, //일정 색깔
    });

    if(info.event.extendedProps.sharer === num){
      setEditModalIsOpen(true);
    } else {
      setShowModalIsOpen(true);
    }
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
        if (res.data) {
          handleGetEvent();
          handleToast("update", true);
        }
      })
      .catch((err) => {
        navigator(`/error`);
      });
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
        editable={true} // 이벤트 수정 가능
        eventResizableFromStart={true}
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
        eventChange={handleEventChange} //이벤트 드롭 & 리사이즈
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
