import Reclike from "./Reclike";
import RecModal from "variables/Modal/RecModal";
import RecReplyList from "./RecReply/RecReplyList";
import axiosInstance from "api/axiosInstance";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardBody, CardTitle, Form, FormGroup } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const RecDetail = ({ handleError, projPkNum }) => {
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호사번호

  const navigate = useNavigate();
  const location = useLocation();

  const updatedData = location.state?.data; //List에서 전달받은 데이터
  const [data, setData] = useState({}); //데이터
  //modal
  const [type, setType] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // const { projPkNum } = useParams(); // 프로젝트 번호
  const { recPkNum } = useParams(); // 건의사항 번호

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    if (updatedData) {
      setData(updatedData);
    } else {
      axiosInstance
        .get(`/conect/${compNum}/rec/${projPkNum}/${recPkNum}`)
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => handleError("게시글을 불러올 수 없습니다.", true));
    }
  };

  const handleDelete = () => {
    axiosInstance
      .delete(`/conect/${compNum}/rec/${data.rec_pk_num}`)
      .then((res) => {
        if (res.data) {
          navigate("../");
        }
      })
      .catch((err) =>
        handleError("게시글 삭제에 실패했습니다. 다시 시도해주세요.", true)
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
          <h2>건의사항</h2>
          {/* 로그인한 유저가 작성한 글만 수정 및 삭제 가능 */}
          {data.rec_fk_user_num === userNum ? (
            <div>
              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate(`../update/${recPkNum}`, { state: data })
                }
              >
                수정
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setType("del");
                  setModalIsOpen(true);
                }}
              >
                삭제
              </button>
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
          <div
            className="d-flex justify-content-between"
            style={{ marginTop: "1em" }}
          >
            <div className="d-flex align-items-center">
              <Reclike recPkNum={recPkNum} likes={data.rec_likes} />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/main/rec/`)}
            >
              목록보기
            </button>
          </div>
        </CardBody>
      </Card>
      <RecReplyList recPkNum={recPkNum} />
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
