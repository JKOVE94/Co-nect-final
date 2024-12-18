import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Row, Col, Card, CardBody, CardHeader, Container } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/*
상위 컴포넌트에는 하단의 코드가 있어야 합니다.
토스트를 표시해야할 상황에는 handleShowM()함수를 호출하면 됩니다.
  const [showM, setShowM] = useState(false); //모달 상태와 관련된 state
  const handleCloseM = () => setShowM(false); //모달을 닫는 함수
  const handleShowM = () => setShowM(true); //모달을 열어주는 함수
*/

function ManageUserModal(props) {
  const handleDeletePermit = () => {
    axios
      .delete(`/${props.compNum}/manage/user/${props.datas.user_pk_num}`)
      .then(() => {
        props.handleFetch(); //부모 컴포넌트에서 데이터를 다시 불러오도록 하는 함수
      })
      .catch((err) => {
        console.error(err);
      });
    props.handleCloseM(); //모달을 닫아줍
  };

  const TypeText = () => {
    switch (props.type) {
      case "delete":
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>직원 정보 삭제</Modal.Title>
            </Modal.Header>
            <Modal.Body>정말 삭제하시겠습니까? </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={props.handleCloseM}>
                취소
              </Button>
              <Button variant="primary" onClick={props.handleDeletePermit}>
                확인
              </Button>
            </Modal.Footer>
          </>
        );
      case "reset":
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>비밀번호 초기화</Modal.Title>
            </Modal.Header>
            <Modal.Body>정말 초기화 하시겠습니까?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={props.handleCloseM}>
                취소
              </Button>
              <Button
                variant="primary"
                onClick={() => props.handleResetPermit(props.datas.user_pk_num)}
              >
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
