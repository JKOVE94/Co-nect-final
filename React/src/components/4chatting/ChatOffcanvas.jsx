import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatHome from "./ChatHome";

const OffcanvasContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.show ? "0" : "-20vw")}; /* 오른쪽에서 슬라이드 */
  width: 20vw;
  height: 100%;
  background-color: #fff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2); /* 왼쪽 그림자 */
  z-index: 1050;
  transition: right 0.3s ease-in-out;
  overflow-y: auto;
`;

const OffcanvasHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid #ddd;
`;

const OffcanvasTitle = styled.h5`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const OffcanvasBody = styled.div`
  padding: 15px;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1049;
  display: ${(props) => (props.show ? "block" : "none")};
`;

function ChatOffcanvas({ show, onClose, title, children, placement = "end" }) {
  const offcanvasRef = useRef(null);

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        offcanvasRef.current &&
        !offcanvasRef.current.contains(event.target) &&
        show
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [offcanvasRef, show, onClose]);

  return (
    <>
      <OffcanvasContainer show={show} ref={offcanvasRef} placement={placement}>
        <OffcanvasHeader>
          <OffcanvasTitle>{title}</OffcanvasTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </OffcanvasHeader>
        <OffcanvasBody style={{ padding: "0" }}>{children}</OffcanvasBody>
      </OffcanvasContainer>
      <Backdrop show={show} onClick={onClose} />
    </>
  );
}

export default ChatOffcanvas;
