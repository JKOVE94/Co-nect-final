import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
  Input,
  Button,
  FormGroup,
  Label,
  Col,
  Row,
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import { Checkbox } from "rsuite";

const WikiCreate = () => {
  const navigate = useNavigate();
  const { wikiPkNum } = useParams(); // URL에서 wikiPkNum 가져오기
  const writer = useSelector((state) => state.userData); // Redux에서 로그인한 유저 정보 가져오기

  // 프로젝트 입력 폼 상태 초기화
  const [formData, setFormData] = useState({
    wiki_name: "", // 제목
    wiki_fk_proj_num: 1, //프로젝트 번호
    wiki_fk_user_num: writer.user_pk_num, // 작성자 번호
    wiki_regdate: "", // 등록일
    wiki_is_notice: false, // 공지
    wiki_desc: "", // 내용
  });

  useEffect(() => {
    // 오늘 날짜를 자동으로 설정
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
    setFormData((prevData) => ({
      ...prevData,
      wiki_regdate: formattedDate, // 등록일에 오늘 날짜 설정
    }));
  }, []);

  // 입력값이 변경될 때마다 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 공지 여부 체크박스 상태 업데이트
  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      wiki_is_notice: !prevData.wiki_is_notice,
    }));
  };

  // 폼 제출 시 실행 (현재는 실제 API 호출 없이 콘솔 로그로만 처리)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData); // 폼 데이터 출력

    // API 호출
    try {
      const response = await axios.post("/wiki/wikiadd", formData);
      const wikiPkNum = response.data;

      navigate(`/main/wiki/wikidetail/${wikiPkNum}`, {
        state: { actionType: "create" },
      });
    } catch (error) {
      console.error("문서 생성 실패:", error);
      alert("문서 생성에 실패했습니다.");
    }
  };

  // 목록 버튼 클릭 시 목록으로 이동
  const handleList = () => {
    navigate("/main/wiki/wikilist"); // 목록 페이지로 이동
  };

  return (
    <Card
      className="shadow rounded"
      style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}
    >
      <CardHeader className="border-1">
        <h2 className="mb-0">문서 작성</h2>
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
                onChange={handleInputChange}
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
                value={writer.user_name}
                onChange={handleInputChange}
                required
                disabled
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
                placeholder="입력하세요"
              />
            </Col>
          </FormGroup>
          
          <FormGroup check row style={{ height: "10%", marginBottom: "12px" }}>
            <Label check sm={2} style={{ fontSize: "14px", fontWeight: "bold" }}>
              공지 여부
            </Label>
            <Col sm={10}>
              <Checkbox
                name="wiki_is_notice"
                checked={formData.wiki_is_notice}
                onChange={handleCheckboxChange}
              />
            </Col>
          </FormGroup>

          <br />
          {/* 버튼들 */}
          <Row form>
            <Col sm={1.5} className="text-center">
              <Button
                style={{
                  backgroundColor: "#1E90FF", // 진하면서도 생기 있는 파란색
                  borderColor: "#1E90FF",
                  color: "white", // 글자 색상 흰색
                }}
                block
                onClick={handleList}
              >
                목록
              </Button>
            </Col>
            <Col sm={1.5} className="text-center">
              <Button
                style={{
                  backgroundColor: "#1E90FF",
                  borderColor: "#1E90FF",
                  color: "white",
                }}
                block
                type="submit"
              >
                저장
              </Button>
            </Col>
          </Row>
        </form>
      </CardBody>
    </Card>
  );
};

export default WikiCreate;
