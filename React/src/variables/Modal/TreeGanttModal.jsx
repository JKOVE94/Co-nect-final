import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";

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
  const handleBlur = (e) => {
    const { name, value } = e.target;
    props.handleChange({ target: { name, value } });
  };

  const TypeText = () => {
    switch (props.type) {
      case "delete":
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>업무 정보 삭제</Modal.Title>
            </Modal.Header>
            <Modal.Body>정말 삭제하시겠습니까? </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={props.handleCloseM}>
                취소
              </Button>
              <Button variant="primary" onClick={props.handleDelete}>
                확인
              </Button>
            </Modal.Footer>
          </>
        );
      case "taskAdd":
        return (
          <>
            <Modal.Body style={{ height: "52em" }}>
              <Container fluid style={{ marginTop: "2em" }}>
                <Row>
                  <Col>
                    <Card>
                      <CardHeader>
                        <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
                          업무 추가
                        </span>
                        <span
                          style={{
                            float: "right",
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "0.15em",
                          }}
                        >
                          <Button
                            className="btn btn-primary"
                            onClick={props.handleInsert}
                          >
                            등록
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={props.handleCloseM}
                          >
                            취소
                          </Button>
                        </span>
                      </CardHeader>
                      <CardBody
                        style={{ maxHeight: "40em", overflowY: "auto" }}
                      >
                        <form>
                          <label htmlFor="task_title">업무명</label>
                          <input
                            className="form-control"
                            type="text"
                            id="task_title"
                            name="task_title"
                            defaultValue={props.editData.task_title}
                            onBlur={handleBlur}
                            required
                          />
                          <br />
                          <label htmlFor="task_desc">설명</label>
                          <input
                            className="form-control"
                            type="text"
                            id="task_desc"
                            name="task_desc"
                            defaultValue={props.editData.task_desc}
                            onBlur={handleBlur}
                          />
                          <br />
                          <label htmlFor="task_fk_user_num">담당자 사번</label>
                          <input
                            className="form-control"
                            type="number"
                            id="task_fk_user_num"
                            name="task_fk_user_num"
                            min="0"
                            defaultValue={props.editData.task_fk_user_num}
                            onBlur={handleBlur}
                            required
                          />
                          <br />
                          <label htmlFor="task_startdate">시작일</label>
                          <input
                            className="form-control"
                            type="Date"
                            id="task_startdate"
                            name="task_startdate"
                            defaultValue={props.editData.task_startdate}
                            onBlur={handleBlur}
                            required
                          />
                          <br />
                          <label htmlFor="task_deadline">마감일</label>
                          <Input
                            className="form-control"
                            type="Date"
                            id="task_deadline"
                            name="task_deadline"
                            defaultValue={props.editData.task_deadline}
                            onBlur={handleBlur}
                            required
                          />
                          <br />
                          <label htmlFor="task_progress">업무 진행도 (%)</label>
                          <input
                            className="form-control"
                            type="number"
                            id="task_progress"
                            name="task_progress"
                            min="0"
                            max="100"
                            defaultValue={props.editData.task_progress}
                            onBlur={handleBlur}
                            required
                          />
                          <br />
                          <label htmlFor="task_status">현재 업무 상태</label>
                          <select
                            className="form-control"
                            name="task_status"
                            id="task_status"
                            defaultValue={props.editData.task_status}
                            onBlur={handleBlur}
                          >
                            <option value="진행중">진행중</option>
                            <option value="미시작">미시작</option>
                            <option value="완료">완료</option>
                          </select>
                          <br />
                          <label htmlFor="task_priority">우선순위</label>
                          <select
                            className="form-control"
                            name="task_priority"
                            id="task_priority"
                            defaultValue={props.editData.task_priority}
                            onBlur={handleBlur}
                          >
                            <option value="1">매우 낮음</option>
                            <option value="2">낮음</option>
                            <option value="3">보통</option>
                            <option value="4">긴급</option>
                            <option value="5">매우 긴급</option>
                          </select>
                          <br />

                          <label htmlFor="task_tag">태그</label>
                          <input
                            className="form-control"
                            type="number"
                            id="task_tag"
                            name="task_tag"
                            defaultValue={props.editData.task_tag}
                            onBlur={handleBlur}
                          />
                          <br />
                          <label htmlFor="task_tagcol">태그 색상</label>
                          <select
                            className="form-control"
                            name="task_tagcol"
                            id="task_tagcol"
                            defaultValue={props.editData.task_tagcol}
                            onBlur={handleBlur}
                          >
                            <option value="red">빨강</option>
                            <option value="blue">파랑</option>
                            <option value="green">초록</option>
                            <option value="orange">주황</option>
                          </select>
                          <br />
                          <label htmlFor="task_fk_task_num">
                            상위 업무 번호
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            id="task_fk_task_num"
                            name="task_fk_task_num"
                            defaultValue={props.editData.task_fk_task_num}
                            onBlur={handleBlur}
                            required
                          />
                        </form>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
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
