import { useEffect, useState } from "react";
import { CloseButton, ToastContainer } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import "../../../assets/css/Calendar.css";

const EventToast = ({ type, isOpen, onClose }) => {
  const [text, setText] = useState();
  useEffect(() => {
    console.log(type);
    if (type === "del") {
      setText("일정이 삭제되었습니다.");
    } else if (type === "update") {
      setText("일정이 수정되었습니다.");
    } else if (type === "add") {
      setText("일정이 등록되었습니다.");
    }
  }, [type]);
  return (
    <ToastContainer position="bottom-end" className="p-1">
      <Toast
        className="toast"
        onClose={onClose}
        show={isOpen}
        delay={3000}
        autohide
      >
        <Toast.Body>
          {text}
          <CloseButton className="closeBtn" onClick={onClose} />
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default EventToast;
