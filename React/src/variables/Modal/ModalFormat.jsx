import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

/*
상위 컴포넌트에는 하단의 코드가 있어야 합니다.
토스트를 표시해야할 상황에는 handleShowM()함수를 호출하면 됩니다.
  const [showM, setShowM] = useState(false); //모달 상태와 관련된 state
  const handleCloseM = () => setShowM(false); //모달을 닫는 함수
  const handleShowM = () => setShowM(true); //모달을 열어주는 함수
*/

function ModalFormat(props) {
  const handlePermit = () => {
    //모달에서 확인 버튼을 눌렀을 때 실행되는 함수
    props.handleCloseM(); //모달을 닫아줍
  };

  const TypeText = () => {
    switch (props.type) {
      case 3:
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>모달 제목을 입력하는 위치입니다.</Modal.Title>
            </Modal.Header>
            <Modal.Body>모달 내용을 입력하는 위치입니다.</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={props.handleCloseM}>
                취소
              </Button>
              <Button variant="primary" onClick={handlePermit}>
                확인
              </Button>
            </Modal.Footer>
          </>
        );
    }
  };
  return (
    <>
      <Modal
        show={props.showM}
        onHide={props.handleCloseM}
        backdrop="static"
        keyboard={false}
      >
        <TypeText />
      </Modal>
    </>
  );
}

export default ModalFormat;
