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
    wiki_title: "", // 제목
    wiki_fk_proj_num: 1, //프로젝트 번호
    wiki_fk_user_num: writer.user_pk_num, // 작성자 번호
    wiki_regdate: "", // 등록일
    wiki_isnotice: false, // 공지
    wiki_content: "", // 내용
    wiki_boardtype: true
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
      wiki_isnotice: !prevData.wiki_isnotice,
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
        <h2 className="mb-0">새 글</h2>
      </CardHeader>

      <CardBody style={{ maxHeight: "calc(100vh - 310px)", overflowY: "auto" }}>
        <form onSubmit={handleSubmit}>
          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="wiki_title"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              제목
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="wiki_title"
                id="wiki_title"
                value={formData.wiki_title}
                onChange={handleInputChange}
                required
              />
            </Col>
          </FormGroup>

          <Input
            type="hidden"
            name="wiki_fk_user_num"
            id="wiki_fk_user_num"
            value={writer.user_name}
            onChange={handleInputChange}
            required
            disabled
          />

          <Input
            type="hidden"
            name="wiki_regdate"
            id="wiki_regdate"
            value={formData.wiki_regdate}
            onChange={handleInputChange}
            required
          />

          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="wiki_content"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              내용
            </Label>
            <Col sm={10}>
              <Input
                type="textarea"
                name="wiki_content"
                id="wiki_content"
                value={formData.wiki_content}
                onChange={handleInputChange}
                required
                placeholder="입력하세요"
              />
            </Col>
          </FormGroup>

          {/* 중요 여부와 버튼들 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Label
                check
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                중요 여부
              </Label>
              <Checkbox
                name="wiki_isnotice"
                checked={formData.wiki_isnotice}
                onChange={handleCheckboxChange}
              />
            </div>

            {/* 파일 선택 버튼 */}
            <Button
              style={{
                backgroundColor: "#696969", // 밝은 회색 배경
                color: "white", // 흰 글자
                padding: "5px 10px", // 작게 조정된 내부 여백
                fontSize: "14px", // 작은 글자 크기
                borderRadius: "5px", // 둥근 모서리
                width: "auto", // 글자 크기에 맞춰 버튼 크기 자동 설정
              }}
            >
              파일 선택
            </Button>
            <p style={{ fontSize: "12px", color: "#888", textAlign: "right" }}>
              (한 번에 하나의 파일만 업로드할 수 있습니다.
              <br />
              여러 파일을 업로드하려면 압축파일(.zip)으로 묶어서 등록해주세요.)
            </p>
            {/* 버튼들 */}
            <Row
              form
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Col
                sm={1.5}
                className="text-center"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  style={{
                    backgroundColor: "#007bff",
                    borderColor: "#007bff",
                    color: "white",
                  }}
                  block
                  type="submit"
                >
                  등록
                </Button>
              </Col>
              <Col
                sm={1.5}
                className="text-center"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  style={{
                    backgroundColor: "#696969",
                    borderColor: "#696969",
                    color: "white",
                  }}
                  block
                  onClick={handleList}
                >
                  목록
                </Button>
              </Col>
            </Row>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default WikiCreate;
