import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import {
  Button,
  Card,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
} from "reactstrap";

const MyToDoList = () => {
  const [data, setData] = useState({
    tasks: [],
    projects: [],
    posts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user_pk_num = useSelector((state) => state.userData.user_pk_num);

  const fetchData = useCallback(() => {
    if (!user_pk_num) {
      setError("사용자 정보를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    axios
      .get(`post/${user_pk_num}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error("데이터 로딩 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user_pk_num]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Container fluid style={{ marginTop: "10rem", width: "100%" }}>
        <Row>
          {/* 대시보드 게시판 */}
          <Col lg={7} className="px-1">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">게시판</h3>
                <Button color="outline-primary" size="sm" className="btnview">
                  더 보기
                </Button>
              </CardHeader>

              <Table responsive style={{ marginBottom: "1rem" }}>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">글 번호</th>
                    <th scope="col">제목</th>
                    <th scope="col">태그</th>
                    <th scope="col">등록일</th>
                    <th scope="col">조회수</th>
                  </tr>
                </thead>
                <tbody>
                  {data.posts && data.posts.length > 0 ? (
                    data.posts.map((item) => (
                      <tr key={item.post_pk_num}>
                        <td>
                          <h6 className="text-sm mb-0">{item.post_pk_num}</h6>
                        </td>
                        <td>
                          <a href="#">
                            <h6 className="text-sm mb-0">{item.post_name}</h6>
                          </a>
                        </td>
                        <td>
                          <h6 className="text-sm mb-0">{item.post_tag}</h6>
                        </td>
                        <td>
                          <h6 className="text-sm mb-0">
                            {new Date(item.post_regdate).toLocaleDateString(
                              "ko-KR",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-sm mb-0">{item.post_view}</h6>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <h6 className="text-sm mb-0">게시글이 없습니다</h6>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
          {/* 이번주 나의 업무 */}
          <Col lg={5} className="px-1">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0 ms-4">이번 주 나의 업무</h3>
                <Button color="outline-primary" size="sm" className="btnview">
                  더 보기
                </Button>
              </CardHeader>
              <Table responsive style={{ marginBottom: "1rem" }}>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">업무 번호</th>
                    <th scope="col">업무</th>
                    <th scope="col">마감일</th>
                    <th scope="col">내용</th>
                  </tr>
                </thead>
                <tbody>
                  {data.tasks && data.tasks.length > 0 ? (
                    data.tasks.map((item) => (
                      <tr key={item.task_pk_num}>
                        <td>
                          <i
                            style={{ color: item.task_tagcol }}
                            className="bi"
                            data-icon={item.task_tag}
                          ></i>
                          <h6 className="text-sm mb-0">{item.task_pk_num}</h6>
                        </td>
                        <td>
                          <h6 className="text-sm mb-0">{item.task_title}</h6>
                        </td>
                        <td>
                          <h6 className="text-sm mb-0">
                            {new Date(item.task_deadline).toLocaleDateString()}
                          </h6>
                        </td>
                        <td>
                          <h6 className="text-sm mb-0">{item.task_desc}</h6>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <h6 className="text-sm mb-0">
                          업무 데이터가 없습니다.
                        </h6>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MyToDoList;
