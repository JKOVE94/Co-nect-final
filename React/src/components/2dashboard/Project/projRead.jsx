import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { Card, CardBody, CardTitle, Col, Container, Row, Table } from "reactstrap";
import axios from "axios";
import ProjToast from "variables/Toast/ProjToast";

const ProjRead = () => {
  const { projPkNum } = useParams(); // URL에서 projPkNum 가져오기
  const [project, setProject] = useState(null);
  const location = useLocation();
  const [type, setType] = useState(0); // 0: 기본값, 1: 등록, 2: 수정

  useEffect(() => {
    // 등록 또는 수정 상태인지 체크
    const actionType = location.state?.actionType;
    if (actionType === "create") {
      setType("create"); // 등록 상태
      toggleShowA(); // 토스트 표시
    } else if (actionType === "update") {
      setType("update"); // 수정 상태
      toggleShowA(); // 토스트 표시
    }

    // 상세 정보 가져오기
    if (projPkNum) {
      const fetchProject = async () => {
        try {
          const response = await axios.get(`/proj/projread/${projPkNum}`);
          if (response.data) {
            setProject(response.data);
          }
        } catch (error) {
          console.error("프로젝트 상세 정보 로딩 실패:", error);
        }
      };
      fetchProject();
    }
  }, [projPkNum, location.state])
  
  const [showA, setShowA] = useState(false);
  const toggleShowA = () => {
    setShowA(true);
    setTimeout(() => {
      setShowA(false);
    }, 3000);
  };

  // 프로젝트가 아직 로딩 중이면 로딩 메시지 표시
  if (!project && projPkNum) {
    return <div>로딩 중...</div>;
  }

  // 상세보기일 때 수정 성공 메시지를 띄우지 않도록 하기
  if (!projPkNum) {
    setType(1); // 등록 메시지를 띄운다.
  }
  return (
    <Container>
      {/* 프로젝트 상세 정보 표시 */}
      <Card className="shadow rounded" style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px", position: "relative", zIndex: 100, overflow: "auto" }}>
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
      <ProjToast type={type} showA={showA} toggleShowA={toggleShowA} />
      
      </Container>     
  );
};

export default ProjRead;
