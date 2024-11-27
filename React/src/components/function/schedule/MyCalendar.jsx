import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import axios from 'axios';
import { useEffect, useState } from "react";
import CalendarModal from "./CalendarModal";

const MyCalendar = () => {
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const [num, setNum] = useState(10); //시큐리티에서 받아올 로그인한 유저 번호
  const [events, setEvents] = useState([{}]);

  const handleEventClick = (clickInfo) => {
    setModalContent({
      title: clickInfo.event._def.title,
      content: clickInfo.event._def.extendedProps.content,
    });
    setModalIsOpen(true);
  }

  const getEvent = () => {
    axios.get('/function/schedule/'+num)
    .then(res => {
      
      let projEvent = res.data.proj.map((data)=>({
        title : data.proj_name,
        start : data.proj_startdate,
        end : data.proj_enddate,
        content : data.proj_desc
      }))
      
      let todoEvent = res.data.todo.map((data)=>({
        title : data.todo_title,
        start : data.todo_start,
        end : data.todo_end,
        content : data.todo_content
      }))
      setEvents([...projEvent, ...todoEvent]);
    })
    .catch(err => console.log(err));
  }

  useEffect(()=> {
    getEvent(); 
  },[]);

  function renderEventContent(eventinfo){
    return (
      <>
        <b>{eventinfo.event.title}</b>
      </>
    );
  }

  return (
    <>
      <FullCalendar 
        plugins={[dayGridPlugin]} //추가기능
        initialView="dayGridMonth" //월별 보기
        headerToolbar={{ //달력 header부분
          start: "prev,next", //오늘날짜, 이전달, 다음달 버튼
          center: "title", //현재 달
          end: "today", //커스텀 버튼(일정 추가)
        }}
        locale={'ko'}
        events={events}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        >
      </FullCalendar>
      <CalendarModal isOpen={modalIsOpen} 
                    onClose={()=>setModalIsOpen(false)}
                    content={modalContent}></CalendarModal>
    </>
  );
};
export default MyCalendar;
