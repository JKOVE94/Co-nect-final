import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const TaskDeleteModal = ({
  deleteModal,
  handleDeleteCancel,
  handleDeleteConfirm,
}) => {
  return (
    <Modal isOpen={deleteModal} toggle={handleDeleteCancel}>
      <ModalHeader toggle={handleDeleteCancel}>삭제 확인</ModalHeader>
      <ModalBody>정말로 삭제하시겠습니까?</ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={handleDeleteConfirm}>
          삭제
        </Button>{" "}
        <Button color="secondary" onClick={handleDeleteCancel}>
          취소
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TaskDeleteModal;
