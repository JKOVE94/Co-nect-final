import React, { useState } from "react";
import ChatOffcanvas from "./ChatOffcanvas";
import ChatHome from "./ChatHome";
import "./chatoffcanvas.css";

// 사용 예시
function ChatOffcnavasSet() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  return (
    <div>
      <button onClick={() => setShowOffcanvas(true)}>
        <div className="offcanvasbtn">
          <i className="bi bi-chat-fill messagebtn"></i>
        </div>
      </button>

      <ChatOffcanvas
        show={showOffcanvas}
        onClose={() => setShowOffcanvas(false)}
        title="채팅"
        placement="end"
        style={{ padding: "0" }}
      >
        <ChatHome />
      </ChatOffcanvas>
    </div>
  );
}

export default ChatOffcnavasSet;
