import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { Card, CardBody, CardTitle, Col, Row, Table } from "reactstrap";
import axios from "axios";
import ProjToast from "variables/Toast/ProjToast";

const ProjRead = () => {
  const { projPkNum } = useParams(); // URL에서 projPkNum 가져오기
  const [project, setProject] = useState(null);
  const location = useLocation();
  const [showToast, setShowToast] = useState(false); // 토스트 표시 상태 관리
  const [toastType, setToastType] = useState(null); // 토스트 유형 관리

  // 1. 프로젝트 데이터 가져오기 (프로젝트 정보 로딩 후)
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`/proj/projread/${projPkNum}`);
        console.log("프로젝트 데이터:", response.data); // 응답 데이터를 콘솔에 출력
        setProject(response.data);

        // 프로젝트 데이터 로딩이 완료되면, 1초 뒤에 토스트를 표시
        setTimeout(() => {
          if (location.state && location.state.toastType) {
            setToastType(location.state.toastType);
            setShowToast(true); // 토스트 표시

            // 일정 시간 후에 토스트 숨기기 (3초 후)
            setTimeout(() => {
              setShowToast(false); // 3초 뒤에 토스트 숨기기
            }, 3000);
          }
        }, 1000); // 1초 뒤에 토스트를 표시
      } catch (error) {
        console.error("프로젝트 상세 정보 로딩 실패:", error); // 에러 메시지 출력
      }
    };
    
    fetchProject();
  }, [projPkNum, location.state]);

  // 프로젝트가 아직 로딩 중이면 로딩 메시지 표시
  if (!project) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      {/* 토스트 메시지 표시 */}
      <ProjToast showA={showToast} toggleShowA={() => setShowToast(false)} type={toastType} />
      
      {/* 프로젝트 상세 정보 표시 */}
      <Card className="shadow rounded" style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px", position: "relative" }}>
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
    </>
  );
};

export default ProjRead;
