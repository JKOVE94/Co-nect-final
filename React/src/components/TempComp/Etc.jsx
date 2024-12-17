import React from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
const Etc = () => {
  return (
    <Container fluid style={{ marginTop: "2rem" }}>
      <Row>
        <Col xs={12} className="px-0">
          <Card className="mx-auto">
            <CardBody className="p-3" style={{ height: "300px" }}>
              <Row className="mx-0"></Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Etc;
