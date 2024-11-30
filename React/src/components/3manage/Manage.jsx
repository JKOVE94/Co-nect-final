import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import ManageSidebar from "./ManageSidebar";
import UserInfo from "./user/UserInfo";
import UserAdd from "./user/UserAdd";
import "../../assets/css/manage/user/User.css";
import UserUpdate from "./user/UserUpdate";
import UserUnlock from "./user/UserUnlock";
import ManageHome from "./ManageHome";
import UserHome from "./user/UserHome";

const Manage = () => {
  return (
    <div>
      <ManageSidebar />

      <Routes>
        <Route path="/manage" element={<ManageHome />}>
          <Route path="user" element={<UserHome />}>
            <Route path="info" element={<UserInfo />} />
            <Route path="add" element={<UserAdd />} />
            <Route path="update/:userno" element={<UserUpdate />} />
            <Route path="unlock/" element={<UserUnlock />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};
export default Manage;
