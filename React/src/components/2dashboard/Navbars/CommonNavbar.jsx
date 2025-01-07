import React, { useEffect, useState } from "react";
import { Sidebar as Side, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { NavItem, NavLink } from "reactstrap";
import { NavLink as NavLinkRRD, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "api/axiosInstance";

const CommonNavbar = (props) => {
  const proj = sessionStorage.getItem("persist:proj_pk_num");
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호

  const [projList, setProjList] = useState([{}]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get(
        `/conect/${compNum}/proj/ProjSel/${userInfo.user_pk_num}`
      );
      setProjList(response.data);
    };
    fetchData();
    return () => {};
  }, []);
  const projNum = sessionStorage.getItem("persist:proj_pk_num");

  return (
    <>
      <Side>
        <Menu>
          <MenuItem>
            <div>
              <select
                style={{
                  width: "95%",
                  height: "3vh",
                  marginLeft: "0.4vw",
                  borderColor: "rgba(0,0,0,0.3)",
                }}
                onChange={(e) => {
                  sessionStorage.setItem("persist:proj_pk_num", e.target.value);
                  props.setProjPkNum(e.target.value);
                }}
              >
                {projList.map((proj) => (
                  <option
                    value={`${proj.proj_pk_num}`}
                    key={proj.proj_pk_num}
                    selected={proj.proj_pk_num == projNum}
                  >
                    {proj.proj_title}
                  </option>
                ))}
              </select>
            </div>
          </MenuItem>
          <hr />
          {/* <SubMenu
            label="즐겨찾기"
            icon={
              <i className="fa fa-bookmark text-primary text-sm opacity-10" />
            }
          >
            <NavItem>
              <NavLink to="/main/projfavorite" tag={NavLinkRRD}>
                프로젝트
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/main/freefavorite" tag={NavLinkRRD}>
                자유게시판
              </NavLink>
            </NavItem>
          </SubMenu>
          */}
          <SubMenu
            label="프로젝트"
            icon={
              <i className="fa fa-briefcase text-info text-sm opacity-10" />
            }
            defaultOpen={true}
          >
            <NavItem>
              <NavLink to={`/main/task/${proj}`} tag={NavLinkRRD}>
                업무 목록
              </NavLink>
              <NavLink to={`/main/task/gantt`} tag={NavLinkRRD}>
                간트차트
              </NavLink>
            </NavItem>
          </SubMenu>
          <SubMenu
            label="게시판"
            icon={
              <i className="fa fa-window-maximize text-success text-sm opacity-10" />
            }
            defaultOpen={true}
          >
            <NavItem>
              <NavLink to="/main/noti/notilist" tag={NavLinkRRD}>
                공지게시판
              </NavLink>
              <NavLink to={`/main/rec/`} tag={NavLinkRRD}>
                건의게시판
              </NavLink>
              <NavLink to="/main/wiki/wikilist" tag={NavLinkRRD}>
                문서게시판
              </NavLink>
              <NavLink to="/main/file/" tag={NavLinkRRD}>
                파일게시판
              </NavLink>
            </NavItem>
          </SubMenu>
          <SubMenu
            label="업무관리"
            icon={
              <i className="ni ni-calendar-grid-58 text-warning text-sm opacity-10" />
            }
            defaultOpen={true}
          >
            <NavItem>
              <NavLink to="/main/function" tag={NavLinkRRD}>
                일정관리
              </NavLink>
            </NavItem>
            {/* <NavItem>
              <NavLink to="" tag={NavLinkRRD}>
                임시저장
              </NavLink>
            </NavItem> */}
          </SubMenu>
        </Menu>
      </Side>
    </>
  );
};

export default CommonNavbar;
