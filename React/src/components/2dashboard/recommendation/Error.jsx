import { Button, Modal } from "react-bootstrap";

const Error = ({isOpen, onClose, err}) => {
    return (
        <>
        {err &&
        <Modal show={isOpen} onHide={onClose} centered>
            <Modal.Header style={{color:'red',fontSize:'1.5rem'}}>
                Error
            </Modal.Header>
            <Modal.Body>
                {err}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="link" onClick={onClose}>닫기</Button>
            </Modal.Footer>
        </Modal>
        }
        </>
    );
}
export default Error;