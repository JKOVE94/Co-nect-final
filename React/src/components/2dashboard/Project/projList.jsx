import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardBody, CardTitle, Col, Row, Table, Button } from "reactstrap";
import axios from "axios";

const ProjList = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/proj/projlist");
        setProjects(response.data);
      } catch (error) {
        console.error("프로젝트 리스트 조회 실패:", error);
      }
    };

    fetchProjects();
  }, []);

  // 프로젝트 상세보기 페이지로 이동하는 함수
  const handleDetail = (projPkNum) => {
    navigate(`/main/proj/projread/${projPkNum}`, { state: { fromList: true } });
  };

  // 프로젝트 수정 페이지로 이동하는 함수
  const handleEditChange = (projPkNum) => {
    navigate(`/main/proj/projedit/${projPkNum}`);
  };

  // 등록 페이지로 이동하는 함수
  const handleInputChange = () => {
    navigate("/main/proj/projadd"); // 등록 페이지로 이동
  };


  return (
    <Card className="shadow rounded" style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}>
      <CardBody style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
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
                    <td colSpan="5">프로젝트 데이터가 없습니다.</td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.proj_pk_num}>
                      <td>
                        <Button color="link" onClick={() => handleDetail(project.proj_pk_num)} style={{ textDecoration: 'none' }}>
                          {project.proj_name}
                        </Button>
                      </td>
                      <td>{project.proj_fk_user_num}</td>
                      <td>{project.proj_fk_dpart_num}</td>
                      <td>{project.proj_status}</td>
                      <td>
                        <Button color="primary" onClick={() => handleEditChange(project.proj_pk_num)}>
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

        {/* 등록 버튼을 왼쪽 하단에 배치 */}
        <Row className="justify-content-start">
          <Col sm={12}>
            <Button color="success" onClick={handleInputChange}>
              프로젝트 등록
            </Button>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ProjList;
