import React from "react";
import { Col, Row, Toast } from "react-bootstrap";

const WikiToast = (props) => {
  const TypeText = ({ type }) => {
    switch (type) {
      case "create":
        return (
          <>
            <Toast.Body style={{ fontSize: "1rem" }}>
              문서가 등록 되었습니다.
            </Toast.Body>
          </>
        );
      case "update":
        return (
          <>
            <Toast.Body style={{ fontSize: "1rem" }}>
              문서가 수정 되었습니다.
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
          style={{
            width: "25rem",
            position: "fixed",
            bottom: "3em",
            right: "3em",
            zIndex: 105,
          }}
        >
          <TypeText type={props.type} />
        </Toast>
      </Col>
    </Row>
  );
};

export default WikiToast;
