import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Reclike from "./Reclike";
import { useSelector } from "react-redux";
import RecModal from "variables/Modal/RecModal";
import RecReplyList from "./RecReply/RecReplyList";
import moment from "moment";

const RecDetail = () => {
  const [type, setType] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [data, setData] = useState({});
  
  const num = useSelector((state) => state.userData.user_pk_num);
  const compNum = JSON.parse(
    //회사번호
    sessionStorage.getItem("persist:userInfo")
  ).user_fk_comp_num;
  const { projPkNum } = useParams(); // 프로젝트 번호
  const { recPkNum } = useParams(); // 건의사항 번호

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    axios
      .get(`/${compNum}/rec/${projPkNum}/${recPkNum}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };
  
  const handleDelete = () => {
    axios.delete(`/${compNum}/rec/${data.rec_pk_num}`)
    .then(res => {if(res.data){
        navigate("../");
    }})
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
              <h2>건의사항</h2>
              {data.rec_fk_user_num === num ? (
                <div>
                  <button className="btn btn-primary" onClick={() => navigate(`../update/${recPkNum}`,{ state: data })}>수정</button>
                  <button className="btn btn-primary" onClick={() => {
                        setType("del");
                        setModalIsOpen(true);
                    }}>삭제</button>
                </div>
              ) : (
                <></>
              )}
            </CardTitle>
            <CardBody className="card-body-scrollable">
              <FormGroup>
                <Form.Label>제목</Form.Label>
                <Form.Control
                  id="rec_title"
                  value={data.rec_title}
                  disabled={true}
                />
              </FormGroup>
              <FormGroup>
                <Form.Label>작성일</Form.Label>
                <Form.Control
                  id="rec_title"
                  value={moment(data.rec_regdate).format("YYYY-MM-DD HH:mm")}
                  disabled={true}
                />
              </FormGroup>
              <FormGroup>
                <Form.Label>조회수</Form.Label>
                <Form.Control
                  id="rec_title"
                  value={data.rec_view}
                  disabled={true}
                />
              </FormGroup>
              <FormGroup>
                <Form.Label>내용</Form.Label>
                <Form.Control
                  as="textarea"
                  value={data.rec_content}
                  disabled={true}
                />
              </FormGroup>
              <Reclike recPkNum={recPkNum} getData={getData} /> 좋아요{" "}
              {data.rec_likes}회
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/main/rec/${projPkNum}`)}
              >
                목록보기
              </button>
            </CardBody>
            <RecReplyList recPkNum={recPkNum} />
          </Card>
        </Col>
      </Row>
      <RecModal
        type={type}
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        fn={handleDelete}
      />
    </>
  );
};
export default RecDetail;
