import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  Button,
  Col,
  Card,
  CardBody,
  Table,
  Row,
  Progress,
  Container,
  CardHeader,
} from "reactstrap";

export default function Projtable() {
  const [projs, setProjs] = useState([]);
  //나중에 reducer 공유자원에서 가져올 compNum
  const compNum = useSelector((state) => state.userData).user_fk_comp_num;
  //const compNum = 1; //테스트용 임시 값 지워주기

  //const compNum = useSelector((state) =>state.compNum);
  const showList = () => {
    axios
      .get(`/proj/${compNum}`)
      .then((res) => {
        // console.log(res.data);
        //최신 날짜 기준으로 프로젝트 5개만 자르기
        const sortData = res.data
          .sort(
            (a, b) => new Date(b.proj_startdate) - new Date(a.proj_startdate)
          )
          .slice(0, 4);
        setProjs(sortData);
      })
      .catch((error) => {
        console.error("showList 오류:" + error);
      });
  };

  useEffect(() => {
    showList();
  }, []);

  const navigate = useNavigate();
  const gotoProjLists = (compNum) => {
    navigate(`/board/projread/${compNum}`);
  };

  //기한 날짜 yyyy-mm-dd 양식 설정
  const dateForm = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    let yyyy_mm_dd = `${year}-${month}-${day}`;
    return yyyy_mm_dd;
  };

  return (
    <Container
      fluid
      style={{ marginTop: "2rem", width: "100%", height: "30vh" }}
    >
      <Row
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          maxHeight: "45vh",
        }}
      >
        <Col lg={13} style={{ width: "100%", height: "100%" }}>
          <Card style={{ width: "100%" }}>
            <CardHeader className="border-0">
              <h className="mb-0" style={{ fontWeight: "bold" }}>
                프로젝트 테이블
              </h>
              <Button
                color="outline-primary"
                size="sm"
                className="btnview"
                onClick={() => gotoProjLists(compNum)}
              >
                더 보기
              </Button>
            </CardHeader>
            <Table responsive style={{ marginBottom: "1rem" }}>
              <thead className="thead-light">
                <tr style={{ color: "gray", textAlign: "center" }}>
                  <th style={{ fontSize: "1rem" }}>프로젝트</th>
                  <th style={{ fontSize: "1rem" }}>담당자</th>
                  <th style={{ fontSize: "1rem" }}>상태</th>
                  <th style={{ fontSize: "1rem" }}>기한</th>
                  <th style={{ fontSize: "1rem" }}>진행도</th>
                </tr>
              </thead>
              <tbody>
                {projs.length === 0 ? (
                  <tr>
                    <td colSpan="6">프로젝트 데이터가 없습니다.</td>
                  </tr>
                ) : (
                  projs.map((proj) => (
                    <tr key={proj.proj_pk_num}>
                      <td style={{ fontWeight: "bold", fontSize: "1rem" }}>
                        {proj.proj_name}
                      </td>
                      <td>
                        <div style={{ fontWeight: "bold", fontSize: "1rem" }}>
                          {proj.proj_username}
                        </div>
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "gray",
                            textAlign: "center",
                          }}
                        >
                          ({proj.proj_userMail})
                        </div>
                      </td>
                      <td style={{ fontSize: "1rem" }}>{proj.proj_status}</td>
                      <td style={{ fontSize: "1rem" }}>
                        {dateForm(proj.proj_enddate)}
                      </td>
                      <td
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Progress
                          value={proj.proj_progress}
                          max={100}
                          style={{ height: "8px" }}
                        />
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "#A0A0A0",
                            marginTop: "3px",
                            textAlign: "center",
                          }}
                        >
                          {`진행률: ${proj.proj_progress || 0}%`}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
