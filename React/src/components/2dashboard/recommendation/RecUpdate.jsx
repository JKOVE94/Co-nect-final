import axiosInstance from "api/axiosInstance";
import RecModal from "variables/Modal/RecModal";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Row,
} from "react-bootstrap";

const RecUpdate = ({ handleError }) => {
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호

  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(location.state); //데이터터
  //modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [type, setType] = useState("");

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClick();
  };

  const handleClick = (e) => {
    axiosInstance
      .put(`/conect/${compNum}/rec/${data.rec_pk_num}`, data)
      .then((res) =>
        navigate(`../detail/${res.data.rec_pk_num}`, {
          state: { data: res.data },
        })
      )
      .catch((err) =>
        handleError("게시글 수정에 실패하였습니다. 다시 시도해주세요.", true)
      );
  };

  return (
    <>
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
        <CardBody style={{ height: "40em", overflowY: "auto" }}>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Form.Label>제목</Form.Label>
              <Form.Control
                id="rec_title"
                value={data.rec_title}
                onChange={handleChange}
                required={true}
              />
            </FormGroup>
            <FormGroup>
              <Form.Label>내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                id="rec_content"
                value={data.rec_content}
                onChange={handleChange}
                required={true}
              />
            </FormGroup>
            <div className="d-flex justify-content-end">
              <button
                style={{ marginTop: "1em" }}
                className="btn btn-primary"
                type="submit"
              >
                수정완료
              </button>
              <button
                style={{ marginTop: "1em" }}
                className="btn btn-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setType("return");
                  setModalIsOpen(true);
                }}
              >
                목록보기
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
      <RecModal
        type={type}
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
    </>
  );
};
export default RecUpdate;
