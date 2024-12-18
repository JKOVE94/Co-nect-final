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

const FreeFavorite = () => {
  const num = useSelector((state) => state.userData.user_pk_num);
  const [favorFree, setFavorFree] = useState([{}]);
  const navigate = useNavigate();

  //페이징
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    getData();
  }, [currentPage]);

  const getData = () => {
    axios
      .get(`/favorite/post/${num}`, {
        params: {
          size: 10,
          page: currentPage,
        },
      })
      .then((res) => {
        //유저의 즐겨찾기 목록을 불러와 favorFree에 저장
        setFavorFree(res.data);
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
      .catch((err) => navigate("/error"));
  };

  return (
    <Container fluid className={style.container}>
      <Card className="mx-auto">
        <CardHeader>
          <h2>즐겨찾기 - 자유게시판</h2>
        </CardHeader>
        <CardBody className="p-10">
          <Table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>분류</th>
                <th>작성자</th>
                <th>등록일</th>
                <th>조회수</th>
                <th className={style.del}></th>
              </tr>
            </thead>
            <tbody>
              {favorFree.totalElements > 0 ? (
                favorFree.content.map((free) => (
                  <tr key={free.favor_id}>
                    <td>{free.post_pk_num}</td>
                    <td>
                      <Link to={`/main/free/detail/${free.post_pk_num}`}>
                        {free.post_name}
                      </Link>
                    </td>
                    <td>{free.post_tag}</td>
                    <td>{free.user_name}</td>
                    <td>{moment(free.post_regdate).format("YYYY-MM-DD")}</td>
                    <td>{free.post_view}</td>
                    <td>
                      <Card.Link
                        className={style.link}
                        onClick={() => handleClick(free.favor_id)}
                      >
                        &times;
                      </Card.Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>즐겨찾기 등록된 글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            <Pagination.Item
            
              onClick={() => handlePageChange(currentPage)}
              disabled={currentPage === 0}
            > {'<<'} </Pagination.Item>
            {[...Array(favorFree.totalPages)].map((num, index) => (
              <Pagination.Item
                key={index}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Item
              onClick={() => handlePageChange(currentPage + 2)}
              disabled={currentPage === favorFree.totalPages - 1}
            > {'>>'} </Pagination.Item>
          </Pagination>
        </CardBody>
      </Card>
    </Container>
  );
};
export default FreeFavorite;
