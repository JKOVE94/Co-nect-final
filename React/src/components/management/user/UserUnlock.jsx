import React, { useState, useEffect } from "react";
import axios from "axios";

const UserUnlock = () => {
  const [userInfos, setUserInfos] = useState([]);

  useEffect(() => {
    axios
      .get("/user/locked")
      .then((res) => {
        console.log(res);
        setUserInfos(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <form action="/manage?fn=ADMIN_LOCKUSER_PROC" method="post">
        <div className="card-header pb-0 d-flex justify-content-between">
          <h2>잠긴 계정 관리</h2>
          <input type="submit" value="저장" className="btn btn-primary" />
        </div>

        <table
          className="table align-items-center justify-content-center mb-0"
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
                  >
                    <option value="0">해제</option>
                    <option value="1">잠김</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default UserUnlock;
