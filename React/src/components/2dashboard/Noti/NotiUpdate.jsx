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
import { Checkbox } from "rsuite";

const NotiUpdate = () => {
  const navigate = useNavigate();
  const { wikiPkNum } = useParams(); // URL에서 projPkNum 가져오기

  const [formData, setFormData] = useState({
    wiki_title: "", // 문서 제목
    wiki_fk_proj_num: "", //프로젝트 번호
    wiki_fk_user_num: "", // 작성자 번호
    wiki_regdate: "", // 등록일
    wiki_isnotice: false, // 공지
    wiki_content: "", // 내용
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

  // 공지 여부 체크박스 상태 업데이트
  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      wiki_isnotice: !prevData.wiki_isnotice,
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
                onChange={handleEditChange}
                required
              />
            </Col>
          </FormGroup>

          <Input
            type="hidden"
            name="wiki_fk_user_num"
            id="wiki_fk_user_num"
            value={formData.user_name} // 이름 표시
            onChange={handleEditChange}
            required
          />

          <Input
            type="hidden"
            name="wiki_regdate"
            id="wiki_regdate"
            value={formData.wiki_regdate}
            onChange={handleEditChange}
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
                onChange={handleEditChange}
                required
                placeholder="입력하세요"
              />
            </Col>
          </FormGroup>
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "12px",
            }}
          >
            {/* 공지 여부 */}
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
              (한 번에 하나의 파일만 업로드할 수 있습니다.<br />
              여러 파일을 업로드하려면 압축파일(.zip)으로 묶어서 등록해주세요.)
            </p>

            {/* 버튼들 */}
            <Row form style={{ display: "flex", justifyContent: "flex-end" }}>
            <Col sm={1.5} className="text-center">
                <Button
                className="btn btn-primary"
                  style={{
                    backgroundColor: "#007bff",
                    borderColor: "#007bff",
                    color: "white",
                  }}
                  block
                  type="submit"
                >
                  수정
                </Button>
              </Col>
              <Col sm={1.5} className="text-center">
                <Button
                  style={{
                    backgroundColor: "#696969",
                    borderColor: "#696969",
                    color: "white",
                  }}
                  block
                  onClick={handleCancel}
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

export default NotiUpdate;
