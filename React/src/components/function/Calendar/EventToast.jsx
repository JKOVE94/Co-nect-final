import { useEffect, useState } from "react";
import { CloseButton, ToastContainer } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";
import "../../../assets/css/Calendar.css";

const EventToast = ({ toastType, isOpen, onClose }) => {
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
      <Toast
        className="toast"
        onClose={onClose}
        show={isOpen}
        delay={3000}
        autohide
      >
        <Toast.Body>
          ℹ️ {text}
          <CloseButton className="closeBtn" onClick={onClose} />
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default EventToast;
