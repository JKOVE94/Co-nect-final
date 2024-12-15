import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Carousel } from "react-bootstrap";
import "../../assets/css/2dashboard/function.css";
import style from "../../assets/css/2dashboard/calendar.module.css";

import {
  Button,
  CardHeader,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Col,
  Container,
  Row,
  Table,
  CarouselItem,
} from "reactstrap";
import moment from "moment";

const MyToDoList = () => {
  const [data, setData] = useState({
    tasks: [],
    projects: [],
    posts: [],
    todos: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todoList, setTodoList] = useState([]);

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
      .get(`/proj/user/${user_pk_num}`)
      .then((res) => {
        setData(res.data);
        updateTodoList(res.data.todos);
      })
      .catch((error) => {
        setError("데이터를 불러오는데 실패했습니다.");
        console.error("데이터 로딩 실패:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user_pk_num]);

  const updateTodoList = useCallback((todos) => {
    const today = moment().startOf('day');
    let dbList = todos.filter(todo => {
      const startDate = moment(todo.todo_startdate);
      const endDate = moment(todo.todo_enddate);
      return today.isSameOrAfter(startDate) && today.isSameOrBefore(endDate);
    }).map(todo => ({
      ...todo,
      start: todo.todo_starttime || '00:00',
      end: todo.todo_endtime || '23:59'
    }));
    setTodoList(dbList);
  }, []);

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
                    data.posts.slice(0, 4).map((item) => (
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
              <CardBody>
                <CardTitle className={style.title}>오늘의 일정</CardTitle>
                {todoList.length === 0 ? (
                  <CardSubtitle className={style.scheduleSub}>
                    오늘의 일정이 없습니다.
                  </CardSubtitle>
                ) : (
                  <Carousel
            slide={false}
            data-bs-theme="dark"
            prevLabel=""
            nextLabel=""
            prevIcon="<"
            nextIcon=">"
            indicators={false}
            interval={null}
          >
                    {todoList.map((todo, index) => (
                      <Carousel.Item key={index}>
                        <div className={style.itembox}>
                          <CardTitle className={style.subtitle}>
                            {todo.todo_title}
                          </CardTitle>
                          <CardSubtitle className={style.sub}>
                            {todo.start} ~ {todo.end}
                          </CardSubtitle>
                          <CardText className={style.item}>
                            {todo.todo_content}
                          </CardText>
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MyToDoList;
