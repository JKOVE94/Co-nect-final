import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'
import axios from 'axios';
import { useEffect, useState } from "react";
import CalendarModal from "./CalendarModal";
import moment from 'moment';
import TodoModal from './TodoModal';
import {Tooltip} from 'react-tippy';
import 'react-tippy/dist/tippy.css'; 

const MyCalendar = () => {
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const [addIsOpen, setAddIsOpen] = useState(false);

  const [num, setNum] = useState(10); //시큐리티에서 받아올 로그인한 유저 번호
  const [events, setEvents] = useState([{}]);

  const [tooltipContent, setTooltipContent] = useState(null); // 툴팁 내용 상태
  const [tooltipTarget, setTooltipTarget] = useState(null); // 툴팁 대상

  const handleEventClick = (clickInfo) => {
    const start = clickInfo.event._instance.range.start;
    const end = clickInfo.event._instance.range.end;
    setModalContent({
      title: clickInfo.event._def.title,
      content: clickInfo.event._def.extendedProps.content,
      start : moment(start).format('YYYY-MM-DD hh:mm:ss'),
      end : moment(end).format('YYYY-MM-DD HH:mm:ss'),
      groupId : clickInfo.event._def.groupId,
      id : clickInfo.event._def.publicId
    });
    setModalIsOpen(true);
  }

  const getEvent = () => {
    axios.get('/function/schedule/'+num)
    .then(res => {
      
      let projEvent = res.data.proj.map((data)=>({
        id : data.proj_pk_num,
        title : data.proj_name,
        start : data.proj_startdate,
        end : data.proj_enddate,
        content : data.proj_desc,
        groupId : 0
      }))
      
      let todoEvent = res.data.todo.map((data)=>({
        id : data.todo_pk_num,
        title : data.todo_title,
        start : data.todo_start,
        end : data.todo_end,
        content : data.todo_content,
        groupId : 1
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
  const handleAdd = () => {
    setAddIsOpen(true);
  }

  const handleEventTippy = (eventinfo) => {
    setTooltipContent(eventinfo.event._def.extendedProps.content);
    setTooltipTarget(eventinfo.el);  // 툴팁이 붙을 이벤트 셀 설정
  };

  // 마우스 떠나면 툴팁 숨기기
  const handleEventMouseLeave = () => {
    setTooltipContent(null);
    setTooltipTarget(null);
  };
  return (
    <>
      <FullCalendar 
        plugins={[dayGridPlugin]} //추가기능
        initialView="dayGridMonth" //월별 보기
        headerToolbar={{ //달력 header부분
          start: "today prev,next", //오늘날짜, 이전달, 다음달 버튼
          center: "title", //현재 달
          end: "addButton" //커스텀 버튼(일정 추가)

        }}
        locale={'ko'}
        events={events}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventMouseEnter={handleEventTippy} // 마우스 오버 시 툴팁 표시
        eventMouseLeave={handleEventMouseLeave} // 마우스 떠날 때 툴팁 숨기기
        customButtons={{
          addButton:{
            text:"일정추가",
            click:()=>{ handleAdd() }
          }
        }}
        >
      </FullCalendar>
      {/* {tooltipContent && tooltipTarget && (
        <Tooltip
          content={tooltipContent}
          position="bottom"
          trigger="mouseenter"
        >
        </Tooltip>
      )} */}

      <CalendarModal isOpen={modalIsOpen} 
                    onClose={()=>setModalIsOpen(false)}
                    content={modalContent}></CalendarModal>
      <TodoModal isOpen={addIsOpen}
                onClose={()=>setAddIsOpen(false)}></TodoModal>
    </>
  );
};
export default MyCalendar;
