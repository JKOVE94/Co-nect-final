import React from "react";
import { Sidebar as Side, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { NavItem, NavLink } from "reactstrap";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";

const CommonNavbar = () => {
    return(
        <>
        <Side>
          <Menu>
              <NavItem>
                <NavLink to="/" tag={NavLinkRRD}><i className="fa fa-users text-primary text-sm opacity-10" />모든 사용자 정보</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/" tag={NavLinkRRD}><i className="fa fa-users  text-sm opacity-10" />사용자 등록</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/" tag={NavLinkRRD}><i className="fa fa-unlock text-info text-sm opacity-10" />사용자 잠금 해제</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/" tag={NavLinkRRD}><i className="fa fa-home text-info text-sm opacity-10" />대시보드로 돌아가기</NavLink>
              </NavItem>
          </Menu>
        </Side>
        </>
    )
}

export default CommonNavbar;