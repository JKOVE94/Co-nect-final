import MyCalendar from "./Calendar/MyCalendar";
import "../../assets/css/Calendar.css";
import MySchedule from "./Schedule/MySchedule";

import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const Function = () => {
  return (
    <>
      <Container fluid style={{ marginTop: "2rem" }}>
        <Row className="mx-0 align-items-start">
          <Col xs={8} className="px-0">
            <Card className="mx-auto">
              <CardBody className="p-10">
                <MyCalendar />
              </CardBody>
            </Card>
            </Col>
            <Col xs={4}>
            <Card className="mx-auto">
              <CardBody className="p-10">
                <MySchedule />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Function;
