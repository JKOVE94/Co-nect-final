import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, CardBody, CardHeader, Container } from "reactstrap";
import ManageUserToast from "variables/Toast/ManageUserToast";

const UserUnlock = () => {
  const [userInfos, setUserInfos] = useState([]);
  const [userLocked, setUserLocked] = useState([]);
  const [type, setType] = useState("");

  useEffect(() => {
    axios
      .get("/manage/user/locked")
      .then((res) => {
        setUserInfos(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleChange = (e) => {
    const userPkNum = parseInt(e.target.dataset.userPkNum, 10);
    const userLockedValue = e.target.value;

    setUserLocked((prevUserLocked) => {
      const updatedUserLocked = prevUserLocked.filter(
        (user) => user.user_pk_num !== userPkNum
      );
      updatedUserLocked.push({
        user_pk_num: userPkNum,
        user_locked: userLockedValue,
      });
      return updatedUserLocked;
    });
  };

  const handlePermit = async () => {
    await axios
      .put("/manage/user/locked", userLocked)
      .then((res) => {
        if (res.data === true) {
          setType("unlocked"); //토스트 타입
          toggleShowA(); //토스트 보이고 자동으로 사라지는 함수
          axios.get("/manage/user/locked").then((res) => {
            setUserInfos(res.data);
          });
        } else {
          setType("error");
          toggleShowA();
        }
      })
      .catch((err) => {
        // console.log("handlePermit err : " + err);
      });
  };

  const [showA, setShowA] = useState(false);
  const toggleShowA = () => {
    setShowA(true);
    setTimeout(() => {
      setShowA(false);
    }, 3000);
  };

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <h2>잠긴 계정 관리</h2>
              <button
                className="btn btn-primary"
                style={{
                  float: "right",
                  position: "relative",
                  marginTop: "0.3em",
                }}
                onClick={handlePermit}
              >
                수정
              </button>
            </CardHeader>
            <CardBody style={{ maxHeight: "40em", overflowY: "auto" }}>
              {userInfos.length > 0 ? (
                <table
                  className="table"
                  style={{ width: "95%", marginLeft: "2em" }}
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: "center" }}>사번</th>
                      <th style={{ textAlign: "center" }}>이름</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {userInfos.map((user) => (
                      <tr key={user.user_pk_num}>
                        <td style={{ textAlign: "center" }}>
                          {user.user_pk_num}
                          <input
                            type="hidden"
                            id={`user_pk_num_${user.user_pk_num}`}
                            name="user_pk_num"
                            value={user.user_pk_num}
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {user.user_name}
                          <input
                            type="hidden"
                            id={`user_name_${user.user_pk_num}`}
                            name="user_name"
                            value={user.user_name}
                          />
                        </td>
                        <td>
                          <select
                            className="form-control-sm"
                            id={`user_locked_${user.user_pk_num}`}
                            name="user_locked"
                            defaultValue={user.user_locked}
                            data-user-pk-num={user.user_pk_num}
                            onChange={handleChange}
                          >
                            <option value="0">해제</option>
                            <option value="1">잠김</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>잠긴 계정이 없습니다.</div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ManageUserToast type={type} showA={showA} toggleShowA={toggleShowA} />
    </Container>
  );
};

export default UserUnlock;
