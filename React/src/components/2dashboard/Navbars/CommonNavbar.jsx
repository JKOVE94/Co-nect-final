import React from "react";
import { Sidebar as Side, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { NavItem, NavLink } from "reactstrap";
import { NavLink as NavLinkRRD, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const CommonNavbar = () => {

  const proj = useSelector((state)=>state.projData.proj_pk_num);

    return(
        <>
        <Side>
          <Menu>
            <SubMenu label="즐겨찾기" icon={<i className="fa fa-bookmark text-primary text-sm opacity-10" />}>
              <NavItem>
                <NavLink to="/main/projfavorite" tag={NavLinkRRD}>프로젝트</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/main/freefavorite" tag={NavLinkRRD}>자유게시판</NavLink>
              </NavItem>
            </SubMenu>
            <SubMenu label="프로젝트" icon={<i className="fa fa-briefcase text-info text-sm opacity-10" />}>
              <NavItem>
              <NavLink to="/main/proj/projlist" tag={NavLinkRRD}>프로젝트 목록</NavLink>
              </NavItem>
            </SubMenu>
            <SubMenu label="게시판" icon={<i className="fa fa-window-maximize text-success text-sm opacity-10" />}>
              <NavItem>
              <NavLink to="/main/noti/notilist" tag={NavLinkRRD}>
                공지게시판
              </NavLink>
              <NavLink to="/main/free" tag={NavLinkRRD}>
                자유게시판
              </NavLink>
              <NavLink to="/main/wiki/wikilist" tag={NavLinkRRD}>
                문서게시판
              </NavLink>
              <NavLink to="/main/file/" tag={NavLinkRRD}>
                파일게시판
              </NavLink>
            </NavItem>
            </SubMenu>
            <SubMenu label="업무관리" icon={<i className="ni ni-calendar-grid-58 text-warning text-sm opacity-10" />}>
              <NavItem>
                <NavLink to="/main/function" tag={NavLinkRRD}>일정관리</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="" tag={NavLinkRRD}>임시저장</NavLink>
              </NavItem>
            </SubMenu>
          </Menu>
        </Side>
        </>
    )
}

export default CommonNavbar;
