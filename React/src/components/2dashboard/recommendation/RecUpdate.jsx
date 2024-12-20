import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
} from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RecModal from "variables/Modal/RecModal";

const RecUpdate = () => {
  const location = useLocation();
  const [data, setData] = useState(location.state);
  const navigate = useNavigate();
  const { projPkNum } = useParams(); //프로젝트번호
  const compNum = JSON.parse( //회사번호
    sessionStorage.getItem("persist:userInfo")
  ).user_fk_comp_num;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [type, setType] = useState("");

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value});
  }

  const handleClick = (e) => {
    axios.put(`/${compNum}/rec/${data.rec_pk_num}`,data)
    .then(res => navigate(`../detail/${res.data.rec_pk_num}`, {
      state: { updatedData: res.data },
    }))
    .catch(err => console.log(err))
  }
  
  return (
    <>
      <Row className="mx-0 align-items-start justify-content-center">
        <Col>
          <Card>
            <CardTitle
              style={{
                display: "flex",
                margin: "1rem",
                justifyContent: "space-between",
              }}
            >
              <h2>건의사항 수정</h2>
            </CardTitle>
            <CardBody style={{ Height: "40em", overflowY: "auto" }}>
              <FormGroup>
                <Form.Label>제목</Form.Label>
                <Form.Control
                  id="rec_title"
                  value={data.rec_title}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Form.Label>내용</Form.Label>
                <Form.Control
                  as="textarea"
                  id="rec_content"
                  value={data.rec_content}
                  onChange={handleChange}
                />
              </FormGroup>
              <div>
              <button
                className="btn btn-primary"
                onClick={handleClick}
              >
                수정완료
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setType("return");
                  setModalIsOpen(true);
                }}
              >
                목록보기
              </button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <RecModal
        type={type}
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
    </>
  );
};
export default RecUpdate;
