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

const ManagerProjDropdown = (props) => {
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" />
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to={`/manage/proj/update/${props.projNum}`}>
          수정
        </Dropdown.Item>
        <Dropdown.Item onClick={() => props.handleDelete(props.projNum)}>
          삭제
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          to={`/manage/proj/addMember/${props.projNum}/${props.projTitle}`}
        >
          프로젝트 팀원 설정
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ManagerProjDropdown;
