import React from "react";
import { Toast, Row, Col } from "react-bootstrap";

/**
 * 부트스트랩 토스트를 사용하기 위한 컴포넌트
 */
//props에 담기는 데이터 => type(어떤 유형인지), showA(토스트표시 함수), toggleShowA(토스트숨김 함수)
const ManageUserToast = (props) => {
  const TypeText = (props) => {
    switch (props.type) {
      case "unlocked":
        return (
          <>
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto" style={{ fontSize: "1rem" }}>
                잠금해제
              </strong>
            </Toast.Header>
            <Toast.Body style={{ fontSize: "1rem" }}>
              계정이 잠금해제 되었습니다.
            </Toast.Body>
          </>
        );
      case "error":
        return (
          <>
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto" style={{ fontSize: "1rem" }}>
                에러 발생
              </strong>
            </Toast.Header>
            <Toast.Body style={{ fontSize: "1rem" }}>
              알 수 없는 에러가 발생했습니다. 다시 시도해주세요.
            </Toast.Body>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Row>
      <Col md={6} className="mb-2">
        <Toast
          show={props.showA}
          onClose={props.toggleShowA}
          className="position-fixed bottom-0 end-0 m-3"
          style={{
            width: "25rem",
            float: "right",
            position: "absolute",
            bottom: "3em",
            right: "3em",
            zIndex: 1050,
          }}
        >
          <TypeText type={props.type} />
        </Toast>
      </Col>
    </Row>
  );
};

export default ManageUserToast;
