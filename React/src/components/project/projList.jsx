import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardBody, CardTitle, Col, Row, Table, Button } from "reactstrap";
import axios from "axios";
import "../../assets/css/argon-dashboard-react.css";

const ProjList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/board/projlist");
        setProjects(response.data);
      } catch (error) {
        console.error("프로젝트 리스트 조회 실패:", error);
      }
    };

    fetchProjects();
  }, []);

  // 프로젝트 상세보기 페이지로 이동하는 함수
  const goToProjectDetails = (projPkNum) => {
    navigate(`/board/projread/${projPkNum}`);
  };

  // 프로젝트 수정 페이지로 이동하는 함수
  const goToProjectEdit = (projPkNum) => {
    navigate(`/board/projedit/${projPkNum}`);
  };

  return (
    <Card className="shadow rounded" style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}>
      <CardBody>
        <h2 className="text-center mb-4">프로젝트 목록</h2>
        <Row>
          <Col sm={12}>
            <CardTitle tag="h5">전체 프로젝트 리스트</CardTitle>
            <Table striped>
              <thead>
                <tr>
                  <th>프로젝트명</th>
                  <th>작성자</th>
                  <th>담당부서</th>
                  <th>상태</th>
                  <th>수정</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan="6">프로젝트 데이터가 없습니다.</td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.proj_pk_num}>
                      <td>
                        <Button color="link" onClick={() => goToProjectDetails(project.proj_pk_num)} style={{ textDecoration: 'none' }}>
                          {project.proj_name}
                        </Button>
                      </td>
                      <td>{project.proj_fk_user_num}</td>
                      <td>{project.proj_fk_dpart_num}</td>
                      <td>{project.proj_status}</td>
                      <td>
                        <Button color="primary" onClick={() => goToProjectEdit(project.proj_pk_num)}>
                          수정
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ProjList;