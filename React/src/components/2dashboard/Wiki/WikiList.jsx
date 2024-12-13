import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardBody, Col, Row, Table, Button } from "reactstrap";
import axios from "axios";

const WikiList = () => {
  const [wikis, setWikis] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/wiki/wikilist");
        setWikis(response.data);
      } catch (error) {
        console.error("프로젝트 리스트 조회 실패:", error);
      }
    };

    fetchProjects();
  }, []);

  // 프로젝트 상세보기 페이지로 이동하는 함수
  const handleDetail = (wikiPkNum) => {
    navigate(`/main/wiki/wikidetail/${wikiPkNum}`, { state: { fromList: true } });
  };

  // 등록 페이지로 이동하는 함수
  const handleInputChange = () => {
    navigate("/main/wiki/wikiadd"); // 등록 페이지로 이동
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 1을 더해서 월을 올바르게 표시
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // "2024-12-13" 형식 반환
  };

  return (
    <Card className="shadow rounded" style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}>
      <CardBody style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
        <h2 className="text-center mb-4">위키 문서 목록</h2>
        <Row>
          <Col sm={12}>
            <Table striped>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>프로젝트명</th>
                  <th>작성자</th>
                  <th>등록일</th>
                </tr>
              </thead>
              <tbody>
                {wikis.length === 0 ? (
                  <tr>
                    <td colSpan="4">문서가 없습니다.</td>
                  </tr>
                ) : (
                  wikis.map((wiki) => (
                    <tr key={wiki.wiki_pk_num}>
                      <td>{wiki.wiki_pk_num}</td>
                      <td>
                        <Button color="link" onClick={() => handleDetail(wiki.wiki_pk_num)} style={{ textDecoration: 'none' }}>
                          {wiki.wiki_name}
                        </Button>
                      </td>
                      <td>{wiki.wiki_fk_user_num}</td>
                      <td>{formatDate(wiki.wiki_regdate)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* 등록 버튼을 왼쪽 하단에 배치 */}
        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "10px" }}>
          <Button color="primary" onClick={handleInputChange}>
            등록
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default WikiList;
