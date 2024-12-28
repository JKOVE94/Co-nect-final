import RecReplylike from "./RecReplylike";
import RecReplyCreate from "./RecReplyCreate";
import axiosInstance from "api/axiosInstance";
import moment from "moment";

import { Button, Col, Dropdown, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const RecReply = ({ data, getData, recPkNum, handleError }) => {
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호

  const [reply, setReply] = useState({}); //댓글
  const [text, setText] = useState(data.reply_content);
  const [hide, setHide] = useState(true);

  useEffect(() => {
    setText(data.reply_content);
    setReply({ ...data, disable: true });
  }, [data]);

  const handleDelete = (replyPkNum) => {
    axiosInstance
      .delete(`/conect/${compNum}/rec/reply/${replyPkNum}`)
      .then((res) => {
        if (res.data) {
          getData();
        }
      })
      .catch((err) =>
        handleError("댓글 삭제에 실패했습니다. 다시 시도해주세요.", true)
      );
  };
  const handleUpdate = (type) => {
    if (type === "up") setReply({ ...reply, disable: false });
    else if (type === "upEnd") setReply({ ...reply, disable: true });
  };

  const handleClick = () => {
    axiosInstance
      .put(`/conect/${compNum}/rec/reply`, reply)
      .then((res) => {
        setReply({ ...res.data, disable: true });
      })
      .catch((err) =>
        handleError("댓글 수정에 실패했습니다. 다시 시도해주세요.", true)
      );
  };

  return (
    <>
      <div
        style={{
          marginLeft: reply.reply_depth * 30 || 0,
          marginBottom: "1rem",
        }}
      >
        <Row style={{ height: "2rem", width: "100%" }}>
          <Col md={11}>
            {reply.reply_depth !== 0 ? "└ " : ""}
            익명{reply.reply_pk_num + 1}
            <br />
            <input
              type="text"
              id="reply_content"
              value={text}
              disabled={reply.disable}
              style={{ width: "70%" }}
              onChange={(e) => {
                setText(e.target.value);
                setReply({ ...reply, [e.target.id]: e.target.value });
              }}
            />
            <Button
              style={{ marginLeft: "1rem" }}
              hidden={reply.disable}
              onClick={handleClick}
              size="sm"
            >
              수정확인
            </Button>
            <RecReplylike replyPkNum={data.reply_pk_num} getData={getData} />{" "}
            {data.reply_likes}
          </Col>
          <Col md={1} className="d-flex align-items-end">
            {reply.reply_fk_user_num === userNum ? (
              <Dropdown>
                <Dropdown.Toggle
                  id="dropdown-item-button"
                  variant="light"
                  className="d-flex align-items-center p-0"
                  style={{
                    background: "none",
                    border: "none",
                    boxShadow: "none",
                  }}
                >
                  <h4>&#8942;</h4>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {reply.disable ? (
                    <Dropdown.Item
                      as="button"
                      onClick={() => {
                        handleUpdate("up");
                      }}
                    >
                      수정
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item
                      as="button"
                      onClick={() => {
                        handleUpdate("upEnd");
                      }}
                    >
                      수정취소
                    </Dropdown.Item>
                  )}

                  <Dropdown.Item
                    as="button"
                    onClick={() => {
                      handleDelete(reply.reply_pk_num);
                    }}
                  >
                    삭제
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <></>
            )}
          </Col>
        </Row>
        <br />
        <div style={{ width: "100%", display: "flex" }}>
          <div style={{ width: "20%" }}>
            <small>
              {moment(reply.reply_regdate).format("YYYY-MM-DD HH:mm")}
            </small>
          </div>
          <div>
            {reply.reply_fk_user_num !== userNum && reply.reply_depth === 0 ? (
              <small
                style={{ cursor: "pointer" }}
                onClick={() => setHide(!hide)}
              >
                답글달기
              </small>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div style={{ marginLeft: "30px" }}>
        <RecReplyCreate
          onHide={hide}
          recPkNum={recPkNum}
          replyParent={reply.reply_parent}
          getData={getData}
          handleError={handleError}
        />
      </div>
    </>
  );
};
export default RecReply;
