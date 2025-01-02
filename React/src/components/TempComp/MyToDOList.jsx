import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
} from "reactstrap";
import moment from "moment";
import axiosInstance from "../../api/axiosInstance"; // axiosInstance 직접 import

const MyToDoList = (props) => {
  const nav = useNavigate();
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const projectNum = JSON.parse(sessionStorage.getItem("persist:proj_pk_num"));
  const userInfo = JSON.parse(userInfoFromRoot);
  const compNum = userInfo.user_fk_comp_num; //회사번호
  const [data, setData] = useState({
    tasks: [],
    projects: [],
    posts: [],
    todos: [],
  });
  const [noticedata, setNoticeData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todoList, setTodoList] = useState([]);

  const user_pk_num = userInfo.user_pk_num; //사번

  const fetchData = useCallback(() => {
    if (!user_pk_num) {
      setError("사용자 정보를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    axiosInstance
      .get(`/conect/${compNum}/proj/user/${user_pk_num}`)
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

    axiosInstance
      .get(`/conect/main/${compNum}/notice/list/${props.projPkNum}`)
      .then((response) => {
        setNoticeData(response.data.content);
      });
  }, [user_pk_num, props.projPkNum]);

  const updateTodoList = useCallback((todos) => {
    const today = moment().startOf("day");
    let dbList = todos
      .filter((todo) => {
        const startDate = moment(todo.todo_startdate);
        const endDate = moment(todo.todo_enddate);
        return today.isSameOrAfter(startDate) && today.isSameOrBefore(endDate);
      })
      .map((todo) => ({
        ...todo,
        start: todo.todo_starttime ? todo.todo_starttime.slice(0, 5) : "00:00",
        end: todo.todo_endtime ? todo.todo_endtime.slice(0, 5) : "23:59",
      }));
    setTodoList(dbList);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateString) => {
    if (!dateString) return "날짜 정보 없음"; // 날짜가 없는 경우 처리
    return moment(dateString).format("YYYY-MM-DD");
  };

  const handlemore = () => {
    nav(`/main/noti/notilist`);
  };
  const moveDetail = (e, noti_pk_num) => {
    e.preventDefault();
    nav(`/main/noti/notidetail/${noti_pk_num}`);
  };

  return (
    <>
      <Container
        fluid
        style={{ width: "100%", display: "flex", flexDirection: "column" }}
      >
        <Row style={{ maxHeight: "14rem" }}>
          {/* 대시보드 게시판 */}
          <Col lg={7} className="px-1">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">공지 게시판</h3>
                <Button
                  color="outline-primary"
                  size="sm"
                  className="btnview"
                  onClick={() => handlemore()}
                >
                  더 보기
                </Button>
              </CardHeader>

              <Table
                responsive
                style={{ marginBottom: "1rem", minHeight: "13rem" }}
              >
                <thead className="thead-light">
                  <tr>
                    <th scope="col">글 번호</th>
                    <th scope="col">제목</th>
                    <th scope="col">등록일</th>
                  </tr>
                </thead>
                <tbody>
                  {noticedata && noticedata.length > 0 ? (
                    noticedata.slice(0, 4).map((item) => (
                      <tr key={item.noti_pk_num}>
                        <td>
                          <h6 className="text-sm mb-0">{item.noti_pk_num}</h6>
                        </td>
                        <td>
                          <a
                            href="#"
                            onClick={(e) => moveDetail(e, item.noti_pk_num)}
                          >
                            <h6 className="text-sm mb-0">{item.noti_title}</h6>
                          </a>
                        </td>
                        <td>
                          <h6 className="text-sm mb-0">
                            {new Date(item.noti_regdate).toLocaleDateString(
                              "ko-KR",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )}
                          </h6>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <h6 className="text-sm mb-0">공지가 없습니다</h6>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
          {/* 이번주 나의 업무 */}
          <Col lg={5} className="px-1">
            <Card className="shadow" style={{ minHeight: "17.8rem" }}>
              <CardBody style={{ minHeight: "13rem" }}>
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
                        <div
                          className={style.itembox}
                          style={{
                            minHeight: "12.5rem",
                            textAlign: "center",
                            alignItems: "center",
                            alignContent: "center",
                          }}
                        >
                          <CardTitle className={style.subtitle}>
                            {todo.todo_title}
                          </CardTitle>
                          <CardSubtitle className={style.sub}>
                            {todo.start} ~ {todo.end}
                          </CardSubtitle>
                          <CardText
                            className={style.item}
                            style={{
                              maxHeight: "9rem",
                              overflowY: "auto",
                              msOverflowStyle: "none",
                              scrollbarWidth: "none",
                            }}
                          >
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
