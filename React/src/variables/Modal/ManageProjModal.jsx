import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Row, Col, Card, CardBody, CardHeader, Container } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "api/axiosInstance";

/*
상위 컴포넌트에는 하단의 코드가 있어야 합니다.
토스트를 표시해야할 상황에는 handleShowM()함수를 호출하면 됩니다.
  const [showM, setShowM] = useState(false); //모달 상태와 관련된 state
  const handleCloseM = () => setShowM(false); //모달을 닫는 함수
  const handleShowM = () => setShowM(true); //모달을 열어주는 함수
*/

function ManageUserModal(props) {
  const nav = useNavigate();
  const handleDeletePermit = async () => {
    const response = await axiosInstance.delete(
      `/conect/${props.compNum}/manage/proj/${props.projPkNumInt}`
    );
    // console.log(response.data);
    if (response.data) {
      props.handleCloseM(); //모달을 닫아줍
      props.fetchProjs();
      nav(`/manage/proj`);
    } else {
      props.handleCloseM(); //모달을 닫아줍
      props.setType("deleteErr");
      props.handleShowM();
    }
  };

  const TypeText = () => {
    switch (props.type) {
      case "delete":
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>프로젝트 삭제</Modal.Title>
            </Modal.Header>
            <Modal.Body>정말 삭제하시겠습니까? </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={props.handleCloseM}>
                취소
              </Button>
              <Button variant="primary" onClick={handleDeletePermit}>
                확인
              </Button>
            </Modal.Footer>
          </>
        );
      case "deleteErr":
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>삭제에 실패했습니다</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              알 수 없는 원인 발생
              <br /> 관리자에게 문의하세요
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

export default ManageUserModal;
