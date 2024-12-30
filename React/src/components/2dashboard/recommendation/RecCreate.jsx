import axiosInstance from "api/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Form } from "react-bootstrap";

const RecCreate = ({ handleError, projPkNum }) => {
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호

  // const { projPkNum } = useParams(); //프로젝트번호

  const [data, setData] = useState([]); //전송 데이터
  const navigate = useNavigate();

  useEffect(() => {
    setData({ ...data, rec_fk_proj_num: projPkNum, rec_fk_user_num: userNum });
  }, []);

  //입력 값 데이터에 저장
  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClick();
  };

  const handleClick = () => {
    axiosInstance
      .post(`/conect/${compNum}/rec/`, data)
      .then((res) => {
        if (res.data) {
          navigate(`/main/rec/`);
        }
      })
      .catch((err) =>
        handleError("게시글 등록에 실패했습니다. 다시 시도해주세요.", true)
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
          <h2>건의사항 등록</h2>
        </CardTitle>
        <CardBody style={{ overflowY: "auto" }}>
          <form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>제목</Form.Label>
              <Form.Control
                type="text"
                id="rec_title"
                placeholder="제목을 작성하세요."
                onChange={handleChange}
                required={true}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                id="rec_content"
                placeholder="내용을 작성하세요."
                onChange={handleChange}
                required={true}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <button
                style={{
                  marginTop: "1em",
                  paddingLeft: "1.5em",
                  paddingRight: "1.5em",
                }}
                className="btn btn-primary"
                type="submit"
              >
                등록
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </>
  );
};
export default RecCreate;
