import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import style from "../../../assets/css/2dashboard/favor.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const {
  Container,
  Card,
  CardBody,
  Table,
  CardHeader,
  Pagination,
} = require("react-bootstrap");

const ProjFavorite = () => {
  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const num = userInfo.user_pk_num; //사번
  const compPkNum = userInfo.user_fk_comp_num; //회사번호

  const [favorProj, setFavorProj] = useState([{}]);
  const navigate = useNavigate();

  //페이징
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    getData();
  }, [currentPage]);

  const getData = () => {
    axios
      .get(`/favorite/proj/${num}`, {
        params: {
          size: 10,
          page: currentPage,
        },
      })
      .then((res) => {
        //유저의 즐겨찾기 목록을 불러와 favorPorj에 저장
        setFavorProj(res.data);
      })
      .catch((err) => navigate("/error"));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber - 1);
  };

  const handleClick = (num) => {
    axios
      .delete("/favorite/" + num)
      .then((res) => {
        if (res.data) {
          getData(); //삭제 성공 후 데이터 다시 불러오기
        }
      })
      .catch();
  };

  return (
    <Container fluid className={style.container}>
      <Card className="mx-auto">
        <CardHeader>
          <h2>즐겨찾기 - 프로젝트</h2>
        </CardHeader>
        <CardBody className="p-10">
          <Table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>분류</th>
                <th>작성자</th>
                <th>중요도</th>
                <th>시작날짜</th>
                <th>종료날짜</th>
                <th className={style.del}></th>
              </tr>
            </thead>
            <tbody>
              {favorProj.totalElements > 0 ? (
                favorProj.content.map((proj) => (
                  <tr key={proj.favor_id}>
                    <td>{proj.proj_pk_num}</td>
                    <td>
                      <Link to={`/main/proj/projdetail/${proj.proj_pk_num}`}>
                        {proj.proj_name}
                      </Link>
                    </td>
                    <td>{proj.proj_tag}</td>
                    <td>{proj.user_name}</td>
                    <td>{proj.proj_import}</td>
                    <td>{moment(proj.proj_startdate).format("YYYY-MM-DD")}</td>
                    <td>{moment(proj.proj_enddate).format("YYYY-MM-DD")}</td>
                    <td>
                      <Card.Link
                        className={style.link}
                        onClick={() => handleClick(proj.favor_id)}
                      >
                        &times;
                      </Card.Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>즐겨찾기 등록된 글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            <Pagination.Item
              onClick={() => handlePageChange(currentPage)}
              disabled={currentPage === 0}
            >
              {" "}
              {"<<"}{" "}
            </Pagination.Item>
            {[...Array(favorProj.totalPages)].map((num, index) => (
              <Pagination.Item
                key={index}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Item
              onClick={() => handlePageChange(currentPage + 2)}
              disabled={currentPage === favorProj.totalPages - 1}
            >
              {" "}
              {">>"}{" "}
            </Pagination.Item>
          </Pagination>
        </CardBody>
      </Card>
    </Container>
  );
};
export default ProjFavorite;
