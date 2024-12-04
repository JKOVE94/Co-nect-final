import React from "react";
import { Col, Row, Toast } from "react-bootstrap";

// props에 담기는 데이터 => type(어떤 유형인지), showA(토스트표시 함수), toggleShowA(토스트숨김 함수)
const ProjToast = (props) => {
  const TypeText = () => {
    switch (props.type) {
      case 1:
        return (
          <>
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto" style={{ fontSize: "1rem" }}>
                프로젝트 등록 성공
              </strong>
            </Toast.Header>
            <Toast.Body style={{ fontSize: "1rem" }}>
              새로운 프로젝트가 성공적으로 등록되었습니다.
            </Toast.Body>
          </>
        );
      case 2:
        return (
          <>
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto" style={{ fontSize: "1rem" }}>
                프로젝트 수정 성공
              </strong>
            </Toast.Header>
            <Toast.Body style={{ fontSize: "1rem" }}>
              프로젝트가 성공적으로 수정되었습니다.
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
            zIndex: 1,
          }}
        >
          <TypeText />
        </Toast>
      </Col>
    </Row>
  );
};

export default ProjToast;