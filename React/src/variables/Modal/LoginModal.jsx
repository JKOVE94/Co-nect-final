import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModalFormat(props) {
  const handlePermitM = () => {
    //문의하기 기능 추가 예정
    props.handleCloseM();
  };

  const TypeText = () => {
    switch (props.type) {
      case 3:
        return (
          <>
            <Modal.Header>
              <Modal.Title>잠긴 계정</Modal.Title>
              <Button 
                variant="link" 
                className="close" 
                onClick={props.handleCloseM}
                style={{ position: 'absolute', right: '1rem', top: '1rem' }}
              >
                <i className="bi bi-x-lg"></i>
              </Button>
            </Modal.Header>
            <Modal.Body>
              로그인 실패 횟수가 5회 초과했습니다. <br />
              관리자에게 문의해주세요
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handlePermitM}>
                문의하기
              </Button>
            </Modal.Footer>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      show={props.showM}
      onHide={props.handleCloseM}
      backdrop="static"
      keyboard={false}
    >
      <TypeText />
    </Modal>
  );
}

export default ModalFormat;
