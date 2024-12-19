import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
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

const NoticeCreate = () => {
  const navigate = useNavigate();
  const projNum = 6; // 테스트 projNum
  const compPkNum = 1; // 테스트 compNum
  const writer = useSelector((state) => state.userData); // Redux에서 로그인한 유저 정보 가져오기

  // Notice 입력 폼 상태 초기화
  const [formData, setFormData] = useState({
    noti_title: "", // 제목
    noti_content: "", // 내용
    noti_fk_proj_num: projNum, // 프로젝트 번호
    noti_fk_user_num: writer.user_pk_num, // 작성자 번호
    noti_import: 0 // 중요도 체크 (기본값 0)
  });

  // 입력값이 변경될 때마다 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 중요도 체크박스 상태 업데이트
  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      noti_import: prevData.noti_import === 0 ? 1 : 0,
    }));
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("전송할 데이터:", formData);
  
    try {
      await axios.post(`/main/${compPkNum}/notice/insert`, formData);
      // 등록 성공 시 리스트 페이지로 리다이렉트
      alert("공지사항이 등록되었습니다.");
      navigate("/main/noti/notilist");
    } catch (error) {
      console.error("공지사항 등록 실패:", error);
      alert("공지사항 등록에 실패했습니다.");
    }
  };

  // 목록으로 이동
  const handleList = () => {
    navigate("/main/noti/notilist");
  };

  return (
    <Card
      className="shadow rounded"
      style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}
    >
      <CardHeader className="border-1">
        <h2 className="mb-0">공지사항 등록</h2>
      </CardHeader>

      <CardBody style={{ maxHeight: "calc(100vh - 310px)", overflowY: "auto" }}>
        <form onSubmit={handleSubmit}>
          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="noti_title"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              제목
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="noti_title"
                id="noti_title"
                value={formData.noti_title}
                onChange={handleInputChange}
                required
                placeholder="제목을 입력하세요"
              />
            </Col>
          </FormGroup>

          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="noti_content"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              내용
            </Label>
            <Col sm={10}>
              <Input
                type="textarea"
                name="noti_content"
                id="noti_content"
                value={formData.noti_content}
                onChange={handleInputChange}
                required
                placeholder="내용을 입력하세요"
                style={{ height: "300px" }}
              />
            </Col>
          </FormGroup>

          {/* 중요도 체크박스 */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Label check style={{ fontSize: "14px", fontWeight: "bold" }}>
                중요 공지
              </Label>
              <Checkbox
                checked={formData.noti_import === 1}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>

          {/* 버튼 영역 */}
          <Row form style={{ display: "flex", justifyContent: "flex-end" }}>
            <Col sm={1.5} style={{ marginRight: "10px" }}>
              <Button
                color="primary"
                type="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#007bff",
                  borderColor: "#007bff",
                }}
              >
                등록
              </Button>
            </Col>
            <Col sm={1.5}>
              <Button
                color="secondary"
                onClick={handleList}
                style={{
                  width: "100%",
                  backgroundColor: "#6c757d",
                  borderColor: "#6c757d",
                }}
              >
                목록
              </Button>
            </Col>
          </Row>
        </form>
      </CardBody>
    </Card>
  );
};

export default NoticeCreate;