import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import axios from "axios";

const UserInfo = () => {
  const nav = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/manage/user").then((data) => {
      setUsers(data.data);
    });
  }, []);

  const updateUser = (id) => {
    nav(`/manage/userupdate/${id}`);
  };

  const deleteUser = (id) => {
    nav(`/manage/userdelete/${id}`);
  };

  return (
    <div>
      <h1>회원 리스트</h1>
      <table>
        <tr>
          <th>사번</th>
          <th>이름</th>
          <th>직급</th>
          <th></th>
          <th></th>
        </tr>
        {users.map((user) => (
          <tr key={user.user_pk_num}>
            <td>{user.user_pk_num}</td>
            <td>{user.user_name}</td>
            <td>{user.user_rank}</td>
            <td>
              <span
                className="click"
                onClick={() => updateUser(user.user_pk_num)}
              >
                수정
              </span>
            </td>
            <td>
              <span
                className="click"
                onClick={() => deleteUser(user.user_pk_num)}
              >
                삭제
              </span>
            </td>
          </tr>
        ))}
        ;
      </table>
      <a
        href="${pageContext.request.contextPath}/manage?fn=ADMIN_MANAGE"
        class="btn btn-primary"
      >
        관리자 페이지로 돌아가기
      </a>
    </div>
  );
};

export default UserInfo;
