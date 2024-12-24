import React, { useState } from "react";
import { Col, Row, Toast } from "react-bootstrap";

// Toast 상태를 전역으로 관리할 객체
let toastConfig = {
 show: false,        // 토스트 표시 여부
 type: '',          // 토스트 메시지 타입(create/update/fail)
 setShow: null,     // 토스트 표시 상태 설정 함수
 setType: null      // 토스트 타입 설정 함수
};

const NotiToast = () => {
 // 토스트 표시 여부와 타입을 관리하는 상태
 const [showA, setShowA] = useState(false);
 const [type, setType] = useState('');
 
 // 컴포넌트 마운트 시 상태 설정 함수들을 전역 객체에 저장
 toastConfig.setShow = setShowA;
 toastConfig.setType = setType;

 // 토스트 타입에 따른 메시지 컴포넌트
 const TypeText = ({ type }) => {
   switch (type) {
     case "create":
       return (
         <Toast.Body style={{ 
           fontSize: "1rem",
           textAlign: "center" // 텍스트 중앙 정렬
         }}>
           문서가 등록 되었습니다.
         </Toast.Body>
       );
     case "update":
       return (
         <Toast.Body style={{ 
           fontSize: "1rem",
           textAlign: "center"
         }}>
           문서가 수정 되었습니다.
         </Toast.Body>
       );
     case "fail":
       return(
         <Toast.Body style={{ 
           fontSize: "1rem", 
           color:'#fa0c00',
           textAlign: "center"
         }}>
           <i className="bi bi-exclamation-square"></i>&nbsp;&nbsp;&nbsp;작성자가 불일치합니다.
         </Toast.Body>
       );
     default:
       return null;
   }
 };

 // 토스트 컴포넌트 렌더링
 return (
   <Row>
     <Col md={6} className="mb-2">
       <Toast
         show={showA}
         onClose={() => setShowA(false)}
         style={{
           width: "25rem",
           position: "fixed",
           bottom: "3em",
           right: "3em",
         }}
         autohide        // 자동으로 사라지는 기능
         delay={2000}    // 2초 후 사라짐
       >
         <TypeText type={type} />
       </Toast>
     </Col>
   </Row>
 );
};

// 외부에서 호출 가능한 토스트 표시 함수들
export const showToast = {
 // 등록 성공 토스트
 create: () => {
   if (toastConfig.setShow && toastConfig.setType) {
     toastConfig.setType('create');
     toastConfig.setShow(true);
     setTimeout(() => toastConfig.setShow(false), 2000);
   }
 },
 // 수정 성공 토스트
 update: () => {
   if (toastConfig.setShow && toastConfig.setType) {
     toastConfig.setType('update');
     toastConfig.setShow(true);
     setTimeout(() => toastConfig.setShow(false), 2000);
   }
 },
 // 작성자 불일치 경고 토스트
 fail: () => {
   if (toastConfig.setShow && toastConfig.setType) {
     toastConfig.setType('fail');
     toastConfig.setShow(true);
     setTimeout(() => toastConfig.setShow(false), 2000);
   }
 }
};

export default NotiToast;