import React, { use } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import { Link } from "react-router-dom";

/*
상위 컴포넌트에는 하단의 코드가 있어야 합니다.
토스트를 표시해야할 상황에는 toggleShowA()함수를 호출하면 됩니다.

 const [showA, setShowA] = useState(false);
    const toggleShowA = () => {
        setShowA(true)
        setTimeout(() => {setShowA(false)}, 3000)
    }
*/

/**
 * 부트스트랩 토스트를 사용하기 위한 컴포넌트
 */
//props에 담기는 데이터 => type(어떤 유형인지), showA(토스트표시 함수), toggleShowA(토스트숨김 함수)
const PostToast = (props) => {
  const TypeText = () => {
    switch (props.type) {
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
                자유게시판
              </strong>
            </Toast.Header>
            <Toast.Body style={{ fontSize: "1rem" }}>
              자유게시판 게시글이 정상적으로 저장되었습니다.
            </Toast.Body>
          </>
        );
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

export default PostToast;
