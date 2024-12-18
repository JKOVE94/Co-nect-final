import React from "react";
import { Sidebar as Side, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { NavItem, NavLink } from "reactstrap";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";

const CommonNavbar = () => {
  return (
    <>
      <Side>
        <Menu>
          <SubMenu
            label="회사 관리"
            icon={
              <i
                className="fa fa-building text-sm opacity-10"
                style={{ color: "#1E88E5" }}
              />
            }
            style={{ color: "black", opacity: "0.6" }}
          >
            <NavItem>
              <NavLink
                to="/manage/company/info"
                tag={NavLinkRRD}
                style={{ color: "black", opacity: "0.5" }}
              >
                <i className="bi bi-info-circle-fill text-sm opacity-10" />
                회사 정보
              </NavLink>
            </NavItem>
          </SubMenu>
          <SubMenu
            label="사원 관리"
            icon={
              <i
                className="fa fa-users text-sm opacity-10"
                style={{ color: "#7E57C2" }}
              />
            }
            style={{ color: "black", opacity: "0.6" }}
          >
            <NavItem>
              <NavLink
                to="/manage/user/info"
                tag={NavLinkRRD}
                style={{ color: "black", opacity: "0.5" }}
              >
                <i className="fa fa-user text-sm opacity-10" />
                전체 사원 정보
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                to="/manage/user/unlock"
                tag={NavLinkRRD}
                style={{ color: "black", opacity: "0.5" }}
              >
                <i className="fa fa-unlock text-sm opacity-10" />
                사용자 잠금 해제
              </NavLink>
            </NavItem>
          </SubMenu>
          <SubMenu
            label="프로젝트 관리"
            icon={
              <i
                className="bi bi-kanban text-sm opacity-10"
                style={{ color: "#26A69A" }}
              />
            }
            style={{ color: "black", opacity: "0.6" }}
          >
            <NavItem>
              <NavLink
                to="/manage/proj/"
                tag={NavLinkRRD}
                style={{ color: "black", opacity: "0.6" }}
              >
                <i className="bi bi-list-ul text-sm opacity-10" />
                전체 프로젝트 정보
              </NavLink>
            </NavItem>
          </SubMenu>
        </Menu>
      </Side>
    </>
  );
};

export default CommonNavbar;
