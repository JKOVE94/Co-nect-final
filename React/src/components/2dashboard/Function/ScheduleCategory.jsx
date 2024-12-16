import { Card } from "react-bootstrap";
import style from "../../../assets/css/2dashboard/calendar.module.css";
import { useEffect, useState } from "react";

const ScheduleCategory = ({ events, setEvents }) => {
  const [selectedCategories, setSelectedCategories] = useState([]); // 체크된 카테고리들을 저장하는 상태

  const handleClick = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      // 카테고리가 체크되면 선택된 카테고리에 추가
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      // 카테고리가 체크 해제되면 선택된 카테고리에서 제거
      setSelectedCategories((prev) =>
        prev.filter((category) => category !== value)
      );
    }
  };

  useEffect(() => {
    if (selectedCategories.length === 0) {
      // 선택된 카테고리가 없으면 모든 일정 표시
      setEvents(events);
    } else {
      // 선택된 카테고리들로 필터링 (하나라도 만족하는 일정)
      const filteredEvents = events.filter((event) =>
        selectedCategories.some((category) => event.category === category)
      );
      setEvents(filteredEvents);
    }
  }, [selectedCategories, events, setEvents]);

  return (
    <>
      <Card.Title className={style.title}>카테고리</Card.Title>
      <Card.Body>
        <ul className={style.ul}>
          <li>
            <input type="checkbox" value="회의" onClick={handleClick} />
            <span style={{marginLeft:"10px" }}>회의 </span>
            <div className={style.colorBox} style={{ backgroundColor: "#53A0EC"}}></div>
          </li>
          <li>
            <input type="checkbox" value="출장" onClick={handleClick} />
            <span style={{marginLeft:"10px" }}>출장 </span>
            <div className={style.colorBox} style={{ backgroundColor: "#FFCC66"}}></div>
          </li>
          <li>
            <input type="checkbox" value="개인일정" onClick={handleClick} />
            <span style={{marginLeft:"10px" }}>개인일정 </span>
            <div className={style.colorBox} style={{ backgroundColor: "#FF9999"}}></div>
          </li>
          <li>
            <input type="checkbox" value="기타" onClick={handleClick} />
            <span style={{marginLeft:"10px" }}>기타 </span>
            <div className={style.colorBox} style={{ backgroundColor: "#9966FF"}}></div>
          </li>
        </ul>
      </Card.Body>
    </>
  );
};

export default ScheduleCategory;
