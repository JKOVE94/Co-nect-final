import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Card, CardBody, Container, Row, Col } from "reactstrap";

const ProjStatus = () => {
  const [proj, setProj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const fetchProjectData = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`/board/projread/${id}`)
      .then((res) => {
        setProj(res.data);
      })
      .catch((error) => {
        setError("프로젝트 데이터를 불러오는데 실패했습니다.");
        console.error("프로젝트 데이터 로딩 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!proj) return <p>프로젝트 정보가 없습니다.</p>;

  return (
    <Container className="mt--7 pt-7" fluid>
      <Row>
        <Col xs={12} className="px-0">
          <Card className="mx-auto">
            <CardBody className="p-3">
              <Row className="mx-0">
                {/*프로젝트 제목 */}
                <Col md={2} className="px-2">
                  <div className="numbers">
                    <p className="text-sm mb-0 text-uppercase font-weight-bold">
                      프로젝트 번호
                    </p>
                    <h5 className="font-weight-bolder">{proj.proj_pk_num}</h5>
                    <p className="mb-0">
                      <span className="text-success text-sm font-weight-bolder">
                        등록일:
                      </span>
                      {proj.proj_created}
                    </p>
                  </div>
                </Col>
                {/*프로젝트 제목 */}
                <Col md={4} className="px-2">
                  <div className="numbers">
                    <p className="text-sm mb-0 text-uppercase font-weight-bold">
                      프로젝트 제목
                    </p>
                    <h5 className="font-weight-bolder mb-2">
                      {proj.proj_name}
                    </h5>
                    <p className="mb-0">
                      <span className="text-success text-sm font-weight-bolder">
                        상태:
                      </span>
                      {proj.proj_import}
                    </p>
                  </div>
                </Col>
                {/*담당자*/}
                <Col md={6} className="px-2">
                  <Row className="mx-0">
                    <Col md={4} className="px-1">
                      <div className="numbers">
                        <p className="text-sm mb-0 text-uppercase font-weight-bold">
                          담당자
                        </p>
                        <h5 className="font-weight-bolder mb-2">
                          {proj.proj_fk_user_num}
                        </h5>
                        <p className="mb-0">
                          <span className="text-success text-sm font-weight-bolder">
                            직책:
                          </span>
                          {proj.proj_tag}
                        </p>
                      </div>
                    </Col>
                    {/*마감일자 */}
                    <Col md={4} className="px-1">
                      <div className="numbers">
                        <p className="text-sm mb-0 text-uppercase font-weight-bold">
                          마감일자
                        </p>
                        <h5 className="font-weight-bolder mb-2">
                          {proj.proj_enddate}
                        </h5>
                        <p className="mb-0">
                          <span className="text-success text-sm font-weight-bolder">
                            남은 기간
                          </span>
                          {proj.proj_progress}
                        </p>
                      </div>
                    </Col>
                    {/*진행도*/}
                    <Col md={4} className="px-1">
                      <div className="numbers">
                        <p className="text-sm mb-0 text-uppercase font-weight-bold">
                          진행도
                        </p>
                        <h5 className="font-weight-bolder mb-2">
                          {proj.proj_progress}
                        </h5>
                        <p className="mb-0">
                          <span className="text-success text-sm font-weight-bolder">
                            상태:
                          </span>
                          {proj.proj_status}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjStatus;
