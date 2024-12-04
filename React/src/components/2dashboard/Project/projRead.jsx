import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, CardBody, CardTitle, Col, Row, Table } from "reactstrap";
import axios from "axios";

const ProjRead = () => {
  const { projPkNum } = useParams(); // URL에서 projPkNum 가져오기
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/proj/projread/${projPkNum}`);
        setProject(response.data);
      } catch (error) {
        console.error("프로젝트 상세 정보 로딩 실패:", error);
      }
    };
    
    fetchProject();
  }, [projPkNum]);

  if (!project) {
    return <div>로딩 중...</div>;
  }

  return (
    <Card className="shadow rounded" style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}>
      <CardBody>
        <h2 className="text-center mb-4">프로젝트 상세</h2>
        <Row>
          <Col sm={12}>
            <CardTitle tag="h5">프로젝트명: {project.proj_name}</CardTitle>
            <Table striped>
              <tbody>
                <tr>
                  <th>작성자</th>
                  <td>{project.proj_fk_user_num}</td>
                </tr>
                <tr>
                  <th>담당부서</th>
                  <td>{project.proj_fk_dpart_num}</td>
                </tr>
                <tr>
                  <th>담당자</th>
                  <td>{project.proj_members}</td>
                </tr>
                <tr>
                  <th>시작일</th>
                  <td>{project.proj_startdate}</td>
                </tr>
                <tr>
                  <th>종료일</th>
                  <td>{project.proj_enddate}</td>
                </tr>
                <tr>
                  <th>우선순위</th>
                  <td>{project.proj_import}</td>
                </tr>
                <tr>
                  <th>상태</th>
                  <td>{project.proj_status}</td>
                </tr>
                <tr>
                  <th>내용</th>
                  <td>{project.proj_desc}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default ProjRead;