import axios from "axios";
import { zhCN } from "date-fns/locale";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import { useSelector } from "react-redux";

const RecReplyCreate = ({ recPkNum, getData, onHide, replyParent }) => {
  const num = useSelector((state) => state.userData.user_pk_num);
  const compNum = JSON.parse(
    //회사번호
    sessionStorage.getItem("persist:userInfo")
  ).user_fk_comp_num;
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
      const response = await axios.post(`/${compNum}/rec/reply`, data);
      if (response.data) {
        setText(""); // 입력 필드 초기화
      }
      await getData(); // 데이터 갱신
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FormGroup hidden={onHide}>
      <FormLabel>댓글쓰기</FormLabel>
      <Row className="align-items-center" style={{ height: "auto" }}>
        <Col md={10}>
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
        <Col md={2}>
          <Button onClick={handleClick}>입력</Button>
        </Col>
      </Row>
    </FormGroup>
  );
};
export default RecReplyCreate;
