import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";
import { Row, Col, Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";
import { GET_DPARTINFO } from "../../../Redux/Reducer/departDataReducer";

import "assets/css/3manage/userinfo.css";
import ManageUserModal from "variables/Modal/ManageUserModal";
import ManagerUserDropdown from "variables/Dropdown/ManagerUserDropdown";
import ManageUserToast from "variables/Toast/ManageUserToast";
import axiosInstance from "api/axiosInstance";

const UserInfo = (props) => {
  const [users, setUsers] = useState([]);
  const [showM, setShowM] = useState(false); //모달 상태와 관련된 state
  const handleCloseM = () => setShowM(false); //모달을 닫는 함수
  const handleShowM = () => setShowM(true); //모달을 열어주는 함수
  const [type, setType] = useState(""); //모달 타입을 결정하는 state
  const [datas, setDatas] = useState({}); //모달에 전달할 데이터를 저장하는 state
  const [toasttype, setToasttype] = useState(""); //토스트 타입을 결정하는 state
  const [showA, setShowA] = useState(true);
  const toggleShowA = () => {
    setShowA(true);
    setTimeout(() => {
      setShowA(false);
    }, 3000);
  };

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

  const handleFetch = async () => {
    const response = await axiosInstance.get(
      `/conect/${props.compNum}/manage/user`
    );
    setUsers(response.data);
  };

  const deleteUser = (id) => {
    setType("delete");
    handleShowM();
    setDatas({ user_pk_num: id });
    handleFetch();
  };

  const resetPW = (id) => {
    setType("reset");
    handleShowM();
    setDatas({ user_pk_num: id });
    handleFetch();
  };

  const moveToAddUser = () => {
    nav(`/manage/user/add/`);
  };

  const handleResetPermit = async (id) => {
    const response = await axiosInstance.put(
      `/conect/${props.compNum}/manage/user/reset/${id}`
    );
    await handleFetch(); //부모 컴포넌트에서 데이터를 다시 불러오도록 하는 함수

    if (response.data) {
      setToasttype("resetComplete");
      toggleShowA();
    } else {
      setToasttype("resetError");
      toggleShowA();
    }
    handleCloseM(); //모달을 닫아줍니다.
  };

  return (
    <>
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
                      <th>아이디</th>
                      <th>이메일</th>
                      <th>계정권한</th>
                      <th style={{ width: "0.1em" }}></th>
                      <th style={{ width: "0.1em" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.user_pk_num}>
                        <td>{user.user_pk_num}</td>
                        <td>{user.user_name}</td>
                        <td>{user.user_id}</td>
                        <td>{user.user_mail}</td>
                        <td>
                          {user.user_author === 1
                            ? "사원"
                            : user.user_author === 2
                            ? "프로젝트 관리자"
                            : user.user_author === 3
                            ? "총 관리자"
                            : "사용 제한"}
                        </td>
                        <td colSpan={2}>
                          <ManagerUserDropdown
                            pkNum={user.user_pk_num}
                            handleDelete={() => deleteUser(user.user_pk_num)}
                            handleReset={() => resetPW(user.user_pk_num)}
                          ></ManagerUserDropdown>
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
          compNum={props.compNum}
          handleResetPermit={handleResetPermit}
        />
      </Container>
    </>
  );
};

export default UserInfo;
