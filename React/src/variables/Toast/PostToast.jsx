import React from "react";
import { Col, Row, Toast } from "react-bootstrap";

// PostToast 컴포넌트: 자유게시판 글 작성/수정 시 알림 Toast를 보여주는 컴포넌트
const PostToast = (props) => {
  // TypeText 컴포넌트: 알림 종류(type)에 따라 알림 메시지를 구성
  const TypeText = ({ type }) => {
    switch (type) {
      case "create": // 글 작성 시 알림 메시지
        return (
          <>
            <Toast.Header>
              {/* 알림 헤더 부분 */}
              <img
                className="rounded me-2" // Bootstrap 스타일로 이미지 간격 조정
                alt=""
              />
              <strong className="me-auto" style={{ fontSize: "1rem" }}>
                🔔알림🔔
              </strong>
            </Toast.Header>
            <Toast.Body style={{ fontSize: "1rem" }}>
              자유게시판 글이 등록되었습니다.
            </Toast.Body>
          </>
        );
      case "update": // 글 수정 시 알림 메시지
        return (
          <>
            <Toast.Header>
              {/* 알림 헤더 부분 */}
              <img
                className="rounded me-2" // Bootstrap 스타일로 이미지 간격 조정
                alt=""
              />
              <strong className="me-auto" style={{ fontSize: "1rem" }}>
                🔔알림🔔
              </strong>
            </Toast.Header>
            <Toast.Body style={{ fontSize: "1rem" }}>
              자유게시판 글이 수정되었습니다.
            </Toast.Body>
          </>
        );
      default: // type이 없거나 알 수 없는 경우, 아무 내용도 표시하지 않음
        return null;
    }
  };

  return (
    <Row>
      <Col md={6} className="mb-2">
        <Toast
          // Bootstrap Toast 컴포넌트를 사용
          show={props.showA} // Toast 표시 여부
          onClose={props.toggleShowA} // Toast 닫기 핸들러
          style={{
            width: "25rem", // Toast의 너비
            position: "fixed", // 화면에 고정
            bottom: "3em", // 화면 하단으로부터 3em 떨어진 위치
            right: "3em", // 화면 오른쪽으로부터 3em 떨어진 위치
            zIndex: 105, // z-index로 화면 내 우선순위 지정
          }}
        >
          <TypeText type={props.type} /> {/* 알림 메시지 내용 렌더링 */}
        </Toast>
      </Col>
    </Row>
  );
};

export default PostToast; // PostToast 컴포넌트 내보내기