import { Button, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const RecModal = ({type, isOpen, onClose, fn}) => {

    const navigate = useNavigate();
    const { projPkNum } = useParams();

    if (type === "del") {
        return (
            <Modal show={isOpen} onHide={onClose} centered>
                <Modal.Header>
                    정말 삭제하시겠습니까?
                </Modal.Header>
                <Modal.Body>
                    <Button onClick={onClose}>취소</Button>
                    <Button onClick={()=>fn()}>삭제</Button>
                </Modal.Body>
            </Modal>
        );
    } else if (type === "return") {
        return (
            <Modal show={isOpen} onHide={onClose} centered>
                <Modal.Header>
                    수정하지 않고 돌아가시겠습니까?
                </Modal.Header>
                <Modal.Body>
                    <Button onClick={()=>navigate(`/main/rec/`)}>예</Button>
                    <Button onClick={onClose}>아니오</Button>
                </Modal.Body>
            </Modal>
        );
        
    }
}
export default RecModal;