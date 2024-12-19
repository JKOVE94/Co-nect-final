import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const RecCreate = () => {
  const num = useSelector((state) => state.userData.user_pk_num); //사번
  const compNum = JSON.parse(
    //회사번호
    sessionStorage.getItem("persist:userInfo")
  ).user_fk_comp_num;
  const { projPkNum } = useParams(); //프로젝트번호

  const [data, setData] = useState([]); //전송 데이터
  const navigate = useNavigate();

  useEffect(() => {
    setData({ ...data, rec_fk_proj_num: projPkNum, rec_fk_user_num: num });
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  const handleClick = () => {
    axios
      .post(`/${compNum}/rec`, data)
      .then((res) => {
        if (res.data) {
          navigate(`/main/rec/${projPkNum}`);
        }
      })
      .catch((err) => console.log(err));
  };

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
              <h2>건의사항 등록</h2>
            </CardTitle>
            <CardBody style={{ Height: "40em", overflowY: "auto" }}>
              <Form.Group>
                <Form.Label>제목</Form.Label>
                <Form.Control
                  type="text"
                  id="rec_title"
                  placeholder="제목을 작성하세요."
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>내용</Form.Label>
                <Form.Control
                  as="textarea"
                  id="rec_content"
                  placeholder="내용을 작성하세요."
                  onChange={handleChange}
                />
              </Form.Group>
              <button className="btn btn-primary" onClick={handleClick}>
                등록
              </button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default RecCreate;
