import React from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
import { ReactComponent as Logo } from "../../assets/1_landing/co-nect logo + text (w).svg";
import "../../App.css";

const Header = () => {
  return (
    <>
      <div
        className="min-height-300 bg-gradient-primary position-absolute w-100 pb-8 pt-5 pt-md-8"
        style={{ zIndex: "-10" }}
      >
        <div className="sidenav-logo-container">
          <Logo></Logo>
        </div>
      </div>
    </>
  );
};

export default Header;
