import React from "react";
import { Route, Routes, Link, Outlet } from "react-router-dom";
import "../../App.css";
import Header from "../headers/Header";
import { Container } from "reactstrap";
import ProjRead from "../project/ProjRead";
import MyToDoList from "../TempComp/MyToDOList";

const DashboardContent = () => (
  <>
    <nav className="navigation">
      <Link to="/board/projread/1" style={{ color: "black", fontSize: "2rem" }}>
        1번 프로젝트 상세
      </Link>
    </nav>
    <MyToDoList />
  </>
);

const Dashboard = () => {
  return (
    <>
      <Header />
      <Container className="pt-7">
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="/board/projread/:id" element={<ProjRead />} />
        </Routes>
        <Outlet />
      </Container>
    </>
  );
};

export default Dashboard;
