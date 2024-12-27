import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";

/*
상위 컴포넌트에는 하단의 코드가 있어야 합니다.
토스트를 표시해야할 상황에는 handleShowM()함수를 호출하면 됩니다.
  const [showM, setShowM] = useState(false); //모달 상태와 관련된 state
  const handleCloseM = () => setShowM(false); //모달을 닫는 함수
  const handleShowM = () => setShowM(true); //모달을 열어주는 함수
*/

function ModalFormat(props) {
  const navigate = useNavigate();
  const handlePermit = () => {
    //모달에서 확인 버튼을 눌렀을 때 실행되는 함수
    props.handleCloseM(); //모달을 닫아줍
    navigate("/manage/user/info"); //사용자 관리 페이지로 이동
  };

  const TypeText = () => {
    switch (props.type) {
      case "addSuccess":
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>사원 등록 성공</Modal.Title>
            </Modal.Header>
            <Modal.Body>사원 정보가 정상적으로 등록되었습니다.</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handlePermit}>
                확인
              </Button>
            </Modal.Footer>
          </>
        );
      case "addFail2":
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>사원 등록 실패</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              이미지 파일이 아닙니다. 이미지 파일을 업로드해주세요{" "}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={props.handleCloseM}>
                확인
              </Button>
            </Modal.Footer>
          </>
        );
      case "addFail3":
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>사원 등록 실패</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              이미지 파일이 너무 큽니다. 5MB미만의 파일을 업로드해주세요{" "}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={props.handleCloseM}>
                확인
              </Button>
            </Modal.Footer>
          </>
        );
      case "addFail4":
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>사원 등록 실패</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              알 수 없는 에러 발생. 관리자에게 문의해주세요.{" "}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={props.handleCloseM}>
                확인
              </Button>
            </Modal.Footer>
          </>
        );
      case "updateFail":
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>사원 정보 수정실패</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              알 수 없는 에러 발생. 관리자에게 문의해주세요.{" "}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={props.handleCloseM}>
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
