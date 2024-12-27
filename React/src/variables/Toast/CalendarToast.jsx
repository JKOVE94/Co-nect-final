import { useEffect, useState } from "react";
import { Button, ToastContainer } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import style from "../../assets/css/2dashboard/calendar.module.css";

const CalendarToast = ({ toastType, isOpen, onClose }) => {
  const [text, setText] = useState();

  useEffect(() => {
    if (toastType === "del") {
      setText("일정이 삭제되었습니다.");
    } else if (toastType === "update") {
      setText("일정이 수정되었습니다.");
    } else if (toastType === "add") {
      setText("일정이 등록되었습니다.");
    }
  }, [toastType]);
  
  return (
    <ToastContainer position="bottom-end" className="p-1">
      <Toast onClose={onClose} show={isOpen} delay={3000} autohide>
        <Toast.Body className={style.text}>
          ℹ️ {text}
          <Button className={style.closeBtn} variant="link" onClick={onClose}>
            &times;
          </Button>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CalendarToast;
