import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const { Container, Row, Col, Card, CardBody, Table } = require("react-bootstrap");

const FreeFavorite = () => {

  const num = useSelector((state) => state.userData.user_pk_num);

  const getData = () => {
    axios.get('/')
  }
  useEffect(() => {

  })

  return (
    <Container fluid style={{ marginTop: "2rem" }}>
      <Card className="mx-auto">
        <CardBody className="p-10">
          <Card.Title>즐겨찾기</Card.Title>
          <Card.Subtitle>자유게시글</Card.Subtitle>
          <Table>
            <thead>
              <tr>
                <th>번호</th><th>제목</th><th>분류</th><th>작성자</th><th>등록일</th><th>조회수</th>
              </tr>
            </thead>
            <tbody>
              <tr>

              </tr>
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </Container>
  );
};
export default FreeFavorite;