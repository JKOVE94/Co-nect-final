import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Row, Col, Card, CardBody, CardHeader, Container } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/*
상위 컴포넌트에는 하단의 코드가 있어야 합니다.
토스트를 표시해야할 상황에는 handleShowM()함수를 호출하면 됩니다.
  const [showM, setShowM] = useState(false); //모달 상태와 관련된 state
  const handleCloseM = () => setShowM(false); //모달을 닫는 함수
  const handleShowM = () => setShowM(true); //모달을 열어주는 함수
*/

function ManageUserModal(props) {
  const [userInfo, setUserInfo] = useState({});
  const departData = useSelector((state) => state.departData);
  const handleDeletePermit = () => {
    //모달에서 확인 버튼을 눌렀을 때 실행되는 함수
    axios
      .delete(`/manage/user/${props.datas.user_pk_num}`)
      .then(() => {
        props.handleFetch(); //부모 컴포넌트에서 데이터를 다시 불러오도록 하는 함수
      })
      .catch((err) => {
        console.error(err);
      });
    props.handleCloseM(); //모달을 닫아줍
  };

  useEffect(() => {
    axios
      .get(`/manage/user/${props.datas.user_pk_num}`)
      .then((data) => {
        setUserInfo(data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [props.datas.user_pk_num]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    console.log(name, value, files);
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpdate = () => {
    const data = new FormData();
    for (const key in userInfo) {
      if (key === "user_picfile") {
        data.append(key, userInfo[key]); // 파일은 그대로 추가
      } else {
        data.append(key, userInfo[key] !== null ? String(userInfo[key]) : ""); // 나머지는 문자열로 변환하여 추가
      }
    }
    axios
      .put(`/manage/user/${userInfo.user_pk_num}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        props.handleFetch();
      })
      .catch((err) => {
        console.error(err);
      });
    props.handleCloseM();
  };

  //input type=date에서 읽을 수 있도록 날짜 타입을 변환하는 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const TypeText = () => {
    switch (props.type) {
      case "delete":
        return (
          <>
            <Modal.Header closeButton>
              <Modal.Title>직원 정보 삭제</Modal.Title>
            </Modal.Header>
            <Modal.Body>정말 삭제하시겠습니까? </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={props.handleCloseM}>
                취소
              </Button>
              <Button variant="primary" onClick={handleDeletePermit}>
                확인
              </Button>
            </Modal.Footer>
          </>
        );
      case "update":
        return (
          <>
            <Modal.Body style={{ height: "52em" }}>
              <Container fluid style={{ marginTop: "2em" }}>
                <Row>
                  <Col>
                    <Card>
                      <CardHeader>
                        <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
                          직원 정보 수정
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
                            onClick={handleUpdate}
                          >
                            수정
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
                          <input
                            type="hidden"
                            name="user_fk_comp_num"
                            value={userInfo.user_fk_comp_num}
                          />
                          <label htmlFor="user_pic">사진</label>
                          <input
                            className="form-control"
                            type="file"
                            id="user_picfile"
                            name="user_picfile"
                          />
                          <br />
                          <label htmlFor="user_pk_num">사번</label>
                          <input
                            className="form-control"
                            type="number"
                            id="user_pk_num"
                            name="user_pk_num"
                            value={userInfo.user_pk_num}
                            readOnly
                            required
                          />
                          <br />
                          <label htmlFor="user_name">이름</label>
                          <input
                            className="form-control"
                            type="text"
                            id="user_name"
                            name="user_name"
                            value={userInfo.user_name}
                            onChange={handleChange}
                            required
                          />
                          <br />
                          <label htmlFor="user_pw">임시비밀번호</label>
                          <input
                            className="form-control"
                            type="password"
                            id="user_pw"
                            name="user_pw"
                            value={userInfo.user_pw}
                            onChange={handleChange}
                            required
                          />
                          <br />
                          <label htmlFor="user_mail">이메일</label>
                          <input
                            className="form-control"
                            type="email"
                            id="user_mail"
                            name="user_mail"
                            value={userInfo.user_mail}
                            onChange={handleChange}
                            required
                          />
                          <br />
                          <label htmlFor="user_regdate">입사일</label>
                          <input
                            className="form-control"
                            type="date"
                            id="user_regdate"
                            name="user_regdate"
                            value={formatDate(userInfo.user_regdate)}
                            onChange={handleChange}
                            required
                          />
                          <br />
                          <label htmlFor="user_rank">직급</label>
                          <select
                            className="form-control"
                            name="user_rank"
                            id="user_rank"
                            value={userInfo.user_rank}
                            onChange={handleChange}
                          >
                            <option value="사원">사원</option>
                            <option value="대리">대리</option>
                            <option value="과장">과장</option>
                            <option value="차장">차장</option>
                            <option value="부장">부장</option>
                            <option value="이사">이사</option>
                            <option value="전무">전무</option>
                            <option value="사장">사장</option>
                          </select>
                          <br />

                          <label htmlFor="user_fk_dpart_num">소속 부서</label>
                          <select
                            className="form-control"
                            id="user_fk_dpart_num"
                            name="user_fk_dpart_num"
                            value={userInfo.user_fk_dpart_num}
                            onChange={handleChange}
                            required
                          >
                            {departData.map((depart) => (
                              <option value={depart.dpart_pk_num}>
                                {depart.dpart_name}
                              </option>
                            ))}
                          </select>
                          <br />

                          <label htmlFor="user_fk_acc_authornum">
                            계정 권한
                          </label>
                          <select
                            className="form-control"
                            id="user_fk_acc_authornum"
                            name="user_fk_acc_authornum"
                            value={userInfo.user_fk_acc_authornum}
                            onChange={handleChange}
                          >
                            <option value="1">유저</option>
                            <option value="2">프로젝트 관리자</option>
                            <option value="3">총 관리자</option>
                            <option value="4">사용제한</option>
                          </select>
                          <br />
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

export default ManageUserModal;
