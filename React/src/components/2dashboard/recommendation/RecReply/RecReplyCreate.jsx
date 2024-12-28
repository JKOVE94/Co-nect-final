import axiosInstance from "api/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";

const RecReplyCreate = ({
  recPkNum,
  getData,
  onHide,
  replyParent,
  handleError,
}) => {
  const num = useSelector((state) => state.userData.user_pk_num); //사번
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호

  const [data, setData] = useState({});
  const [text, setText] = useState("");

  useEffect(() => {
    setData({
      ...data,
      reply_fk_user_num: num,
      reply_fk_rec_num: recPkNum,
      reply_depth: replyParent ? 1 : 0,
      reply_parent: replyParent || null,
    });
  }, [recPkNum, num, replyParent]);

  const handleClick = async () => {
    try {
      const response = await axiosInstance.post(
        `/conect/${compNum}/rec/reply`,
        data
      );
      if (response.data) {
        setText(""); // 입력 필드 초기화
      }
      await getData(); // 데이터 갱신
    } catch (err) {
      handleError("댓글 등록에 실패했습니다. 다시 시도해주세요.", true);
    }
  };

  return (
    <FormGroup hidden={onHide}>
      <Row
        className="align-items-center justify-content-start"
        style={{ height: "auto" }}
      >
        <Col md={"auto"}>댓글쓰기</Col>
        <Col md={9}>
          <FormControl
            type="text"
            id="reply_content"
            placeholder="댓글을 입력하세요."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setData({ ...data, reply_content: e.target.value });
            }}
          />
        </Col>
        <Col md={"auto"}>
          <Button onClick={handleClick}>입력</Button>
        </Col>
      </Row>
    </FormGroup>
  );
};
export default RecReplyCreate;
