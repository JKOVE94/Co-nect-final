import React from "react";
import {
  Card,
  CardHeader,
  Table,
  Button,
  Row,
  Col,
  CardBody,
} from "reactstrap";

const Item1 = () => {
  return (
    <Row className="mt-0">
      {/* xl 값으로 좌우 조절  */}
      <Col className="mb-5 mb-xl-0" xl="5">
        <Card className="shadow">
          <CardHeader className="border-0">
            <h3 className="mb-0">Card tables</h3>
          </CardHeader>
          <CardBody>hello</CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Item1;
