import React from "react";
import "../../App.css";
import { Button, Card, CardBody, Col, Container, Row, Table } from "reactstrap";

const MyToDoList = () => {
  return (
    <>
      <Container fluid style={{ marginTop: "2rem" }}>
        <Row>
          <Col lg={7} className="px-0">
            <Card className="mx-auto custom-card">
              <CardBody className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 ms-4">게시판</h6>
                  <Button
                    color="outline-primary"
                    size="sm"
                    className="btnview"
                    style={{ marginTop: "1rem" }}
                  >
                    더 보기
                  </Button>
                </div>
                <div
                  className="table-responsive"
                  style={{ marginLeft: "1rem", marginTop: "-1rem" }}
                >
                  <Table className="align-items-center custom-table">
                    <thead>
                      <tr>
                        <th className="text-center text-secondary text-xs font-weight-bolder opacity-7">
                          글 번호
                        </th>
                        <th className="text-center text-secondary text-xs font-weight-bolder opacity-7">
                          제목
                        </th>
                        <th className="text-center text-secondary text-xs font-weight-bolder opacity-7">
                          작성자
                        </th>
                        <th className="text-center text-secondary text-xs font-weight-bolder opacity-7">
                          등록일
                        </th>
                        <th className="text-center text-secondary text-xs font-weight-bolder opacity-7">
                          조회수
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="center">
                          <h6 className="text-sm mb-0">(post_pk_num)</h6>
                        </td>
                        <td>
                          <a href="#">
                            <h6 className="text-sm mb-0">(post_name)</h6>
                          </a>
                        </td>
                        <td className="center">
                          <h6 className="text-sm mb-0">(user_name)</h6>
                        </td>
                        <td className="center">
                          <h6 className="text-sm mb-0">(post_regdate)</h6>
                        </td>
                        <td className="center">
                          <h6 className="text-sm mb-0">(post_view)</h6>
                        </td>
                      </tr>
                      {/* 필요한 만큼 <tr> 요소를 반복하여 추가할 수 있습니다 */}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={5} className="px-0">
            <Card className="mx-auto custom-card" style={{ height: "100%" }}>
              <CardBody className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 ms-4">이번 주 나의 업무</h6>
                  <Button color="outline-primary" size="sm" className="btnview">
                    더 보기
                  </Button>
                </div>
                <div
                  className="table-responsive"
                  style={{ marginTop: "-1rem" }}
                >
                  <Table className="align-items-center custom-table">
                    <tbody>
                      <tr>
                        <td>
                          <i
                            style={{ color: "(todo_tagcol)" }}
                            className="bi"
                            data-icon="(todo_icon)"
                          ></i>
                        </td>
                        <td>
                          <div className="ms-4">
                            <p className="text-xs font-weight-bold mb-0">
                              업무 번호:
                            </p>
                            <h6 className="text-sm mb-0">(todo_pk_num)</h6>
                          </div>
                        </td>
                        <td>
                          <div className="ms-4">
                            <p className="text-xs font-weight-bold mb-0">
                              업무:
                            </p>
                            <h6 className="text-sm mb-0">(todo_title)</h6>
                          </div>
                        </td>
                        <td>
                          <div className="ms-4">
                            <p className="text-xs font-weight-bold mb-0">
                              마감일:
                            </p>
                            <h6 className="text-sm mb-0">(todo_end)</h6>
                          </div>
                        </td>
                        <td>
                          <div className="ms-4">
                            <p className="text-xs font-weight-bold mb-0">
                              내용:
                            </p>
                            <h6 className="text-sm mb-0">(todo_content)</h6>
                          </div>
                        </td>
                      </tr>
                      {/* 필요한 만큼 <tr> 요소를 반복하여 추가할 수 있습니다 */}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MyToDoList;
