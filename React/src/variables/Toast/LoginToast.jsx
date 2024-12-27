import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";

const ToastFunction = (props) => {
  const TypeText = () => {
    return (
      <>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto" style={{ fontSize: "1rem" }}>
            로그인 실패
          </strong>
        </Toast.Header>
        <Toast.Body style={{ fontSize: "1rem" }}>
          로그인에 실패하셨습니다. 다시 시도해주세요.
        </Toast.Body>
      </>
    );
  };

  return (
    <Row>
      <Col md={6} className="mb-2">
        <Toast
          show={props.showA}
          onClose={props.toggleShowA}
          style={{
            width: "25rem",
            position: "fixed",
            bottom: "3em",
            right: "3em",
            zIndex: 1,
          }}
        >
          <TypeText />
        </Toast>
      </Col>
    </Row>
  );
};

export default ToastFunction;
