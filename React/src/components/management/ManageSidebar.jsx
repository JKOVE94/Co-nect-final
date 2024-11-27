import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";

const ManageSidebar = () => {
  return (
    <div>
      <Sidebar>
        <Menu>
          <SubMenu label="사용자 정보">
            <MenuItem>
              <Link to="/manage/user/info">모든 사용자 정보</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/manage/user/add">사용자 등록</Link>
            </MenuItem>
            <MenuItem> 사용자 수정 </MenuItem>
            <MenuItem>
              <Link to="/manage/user/unlock/">사용자 잠금해제</Link>
            </MenuItem>
          </SubMenu>
          <MenuItem> 대시보드로 돌아가기 </MenuItem>
        </Menu>
      </Sidebar>
      ;
    </div>
  );
};
export default ManageSidebar;
