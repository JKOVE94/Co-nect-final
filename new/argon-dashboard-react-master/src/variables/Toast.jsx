import React,{use} from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';

/**
 * 부트스트랩 토스트를 사용하기 위한 컴포넌트
 */
const ToastFunction = (props) => {

  const TypeText = () => {
    if(props.type==='loginfail'){
      return(
        <>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">로그인 실패</strong>
          </Toast.Header>
          <Toast.Body>
            로그인에 실패하셨습니다.<br/>
            다시한번 로그인 해주세요.
          </Toast.Body>
          </>
      )
    }
    else if(props.type==='delete'){
      return(
        <>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">제품 삭제 성공</strong>
          </Toast.Header>
          <Toast.Body>제품이 성공적으로 삭제 되었습니다.</Toast.Body>
          </>
      )
    }
    else if(props.type==='empty'){
      return(
        <>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">결제 실패</strong>
          </Toast.Header>
          <Toast.Body>장바구니가 비어있습니다.</Toast.Body>
          </>
      )
    }
  }

  return (
    <Row>
      <Col md={6} className="mb-2">
        <Toast 
          show={props.showA} 
          onClose={props.toggleShowA} 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1
          }}
        >
          <TypeText/>
        </Toast>
      </Col>
    </Row>
  );
}

export default ToastFunction;