import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import { Row, Col, Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";
import { GET_DPARTINFO } from "../../../Redux/Reducer/departDataReducer";

import "assets/css/3manage/userinfo.css";
import ManageUserModal from "variables/Modal/ManageUserModal";
import UserDropdown from "variables/Dropdown/UserDropdown";

const UserInfo = () => {
  const [users, setUsers] = useState([]);
  const [showM, setShowM] = useState(false); //모달 상태와 관련된 state
  const handleCloseM = () => setShowM(false); //모달을 닫는 함수
  const handleShowM = () => setShowM(true); //모달을 열어주는 함수
  const [type, setType] = useState(""); //모달 타입을 결정하는 state
  const [datas, setDatas] = useState({}); //모달에 전달할 데이터를 저장하는 state
  const [departData, setDepartData] = useState([]);

  const departDataOrigin = useSelector((state) => state.departData);

  const nav = useNavigate();

  useEffect(() => {
    handleFetch();
  }, []);

  useEffect(() => {
    // 부서 정보를 한 번만 설정
    if (departDataOrigin.length > 0) {
      setDepartData(departDataOrigin);
    }
  }, [departDataOrigin]);

  const handleFetch = () => [
    axios.get("/manage/user").then((data) => {
      setUsers(data.data);
    }),
  ];

  const updateUser = (id) => {
    setType("update");
    handleShowM();
    setDatas({ user_pk_num: id });
    handleFetch();
  };

  const deleteUser = (id) => {
    setType("delete");
    handleShowM();
    setDatas({ user_pk_num: id });
    handleFetch();
  };

  const getDepartmentName = (dpart_pk_num) => {
    return departData.filter((dpart) => dpart.dpart_pk_num === dpart_pk_num)[0]
      .dpart_name;
  };

  const moveToAddUser = () => {
    nav("/manage/user/add");
  };

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <h2>전체 사원 정보</h2>
              <button
                className="btn btn-primary"
                onClick={() => moveToAddUser()}
              >
                사원 추가
              </button>
            </CardHeader>
            <CardBody style={{ maxHeight: "40em", overflowY: "auto" }}>
              <table className="table" style={{ fontSize: "1.2rem" }}>
                <thead>
                  <tr>
                    <th>사번</th>
                    <th>이름</th>
                    <th>직급</th>
                    <th>부서</th>
                    <th>입사일</th>
                    <th style={{ width: "0.1em" }}></th>
                    <th style={{ width: "0.1em" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.user_pk_num}>
                      <td>{user.user_pk_num}</td>
                      <td>{user.user_name}</td>
                      <td>{user.user_rank}</td>
                      <td>{getDepartmentName(user.user_fk_dpart_num)}</td>
                      <td>{user.user_regdate.slice(0, 10)}</td>
                      <td colSpan={2}>
                        <UserDropdown pkNum={user.user_pk_num}></UserDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ManageUserModal
        handleCloseM={handleCloseM}
        handleShowM={handleShowM}
        showM={showM}
        type={type}
        datas={datas}
        handleFetch={handleFetch}
      />
    </Container>
  );
};

export default UserInfo;
