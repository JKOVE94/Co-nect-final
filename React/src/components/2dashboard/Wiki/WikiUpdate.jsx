import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Input,
  Button,
  FormGroup,
  Label,
  Col,
  Card,
  CardBody,
  Row,
  CardHeader,
} from "reactstrap";

const WikiUpdate = () => {
  const navigate = useNavigate();
  const { wikiPkNum } = useParams(); // URL에서 projPkNum 가져오기

  const [formData, setFormData] = useState({
    wiki_name: "", // 프로젝트명
    wiki_fk_proj_num: "", //프로젝트 번호
    wiki_fk_user_num: "", // 작성자 번호
    wiki_regdate: "", // 등록일
    wiki_is_notice: false, // 공지
    wiki_desc: "", // 내용
    user_name: "", // 작성자 이름
  });

  // API에서 데이터 불러오기
  useEffect(() => {
    const fetchWikiData = async () => {
      try {
        const response = await axios.get(`/wiki/wikidetail/${wikiPkNum}`);
        const wikiData = response.data;

        // 날짜 형식을 yyyy-MM-dd로 변환
        const regdate = new Date(wikiData.wiki_regdate)
          .toISOString()
          .split("T")[0];

        // 데이터 설정
        setFormData({
          ...wikiData,
          wiki_regdate: regdate,
        });
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchWikiData();
  }, [wikiPkNum]);

  // 입력값 변경될 때마다 상태 업데이트
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/wiki/wikiedit/${wikiPkNum}`, formData); // 수정 API 호출
      // console.log("수정 성공:", response.data);

      navigate(`/main/wiki/wikidetail/${wikiPkNum}`, {
        state: { actionType: "update" },
      }); // 수정 후 목록 페이지로 이동
    } catch (error) {
      // console.error("수정 실패:", error);
    }
  };

  // 취소 버튼 클릭 시 목록으로 이동
  const handleCancel = () => {
    navigate("/main/wiki/wikilist");
  };

  return (
    <Card
      className="shadow rounded"
      style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}
    >
      <CardHeader className="border-1">
        <h2 className="mb-0">문서 수정</h2>
      </CardHeader>

      <CardBody style={{ maxHeight: "calc(100vh - 310px)", overflowY: "auto" }}>
        <form onSubmit={handleSubmit}>
        <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="wiki_name"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              제목 
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="wiki_name"
                id="wiki_name"
                value={formData.wiki_name} 
                onChange={handleEditChange}
                required
              />
            </Col>
          </FormGroup>

          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="wiki_fk_user_num"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              작성자
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="wiki_fk_user_num"
                id="wiki_fk_user_num"
                value={formData.user_name} // 이름 표시
                onChange={handleEditChange}
                required
                disabled // 사용자가 수정하지 못하도록
              />
            </Col>
          </FormGroup>

          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="wiki_regdate"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              등록일
            </Label>
            <Col sm={10}>
              <Input
                type="date"
                name="wiki_regdate"
                id="wiki_regdate"
                value={formData.wiki_regdate}
                onChange={handleEditChange}
                required
              />
            </Col>
          </FormGroup>

          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="wiki_desc"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              내용
            </Label>
            <Col sm={10}>
              <Input
                type="textarea"
                name="wiki_desc"
                id="wiki_desc"
                value={formData.wiki_desc}
                onChange={handleEditChange}
                required
                placeholder="입력하세요"
              />
            </Col>
          </FormGroup>
          <br />
          <Row form>
            <Col sm={1.5} className="text-center">
              <Button
                style={{
                  backgroundColor: "#1E90FF", // 같은 색상
                  borderColor: "#1E90FF",
                  color: "white", // 글자 색상 흰색
                }}
                block
                type="submit"
              >
                수정 완료
              </Button>
            </Col>
            <Col sm={1.5} className="text-center">
              <Button
                style={{
                  backgroundColor: "#1E90FF", // 진하면서도 생기 있는 파란색
                  borderColor: "#1E90FF", // 동일한 색상
                  color: "white", // 글자 색상 흰색
                }}
                block
                onClick={handleCancel}
              >
                취소
              </Button>
            </Col>
          </Row>
        </form>
      </CardBody>
    </Card>
  );
};

export default WikiUpdate;
