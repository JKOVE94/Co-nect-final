import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <i
    className="bi bi-three-dots"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    style={{ cursor: "pointer" }}
  >
    {children}
  </i>
));

const UserDropdown = () => {
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />

      <Dropdown.Menu>
        <Dropdown.Item>
          <Link>수정</Link>
        </Dropdown.Item>
        <Dropdown.Item href="#/action-2">삭제</Dropdown.Item>
        <Dropdown.Item href="#/action-3">비밀번호 초기화</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserDropdown;
