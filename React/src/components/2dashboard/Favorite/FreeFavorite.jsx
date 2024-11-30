const { Container, Row, Col, Card, CardBody, Table } = require("react-bootstrap");

const FreeFavorite = () => {
  return (
    <Container fluid style={{ marginTop: "2rem" }}>
      <Card className="mx-auto">
        <CardBody className="p-10">
          <Card.Title>즐겨찾기</Card.Title>
          <Card.Subtitle>자유게시글</Card.Subtitle>
          <Table>
            <thead>
              <tr>
                <th></th>
              </tr>
            </thead>

          </Table>
        </CardBody>
      </Card>
    </Container>
  );
};
export default FreeFavorite;