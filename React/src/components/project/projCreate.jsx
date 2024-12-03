import axios from "axios";
import React, { useState } from "react";
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
import { toast } from 'react-toastify'; // react-toastify 임포트
import 'react-toastify/dist/ReactToastify.css'; // 스타일시트 임포트

const ProjCreate = () => {
  const navigate = useNavigate();
  const { projPkNum } = useParams(); // URL에서 projPkNum 가져오기

  const [formData, setFormData] = useState({
    proj_name: "",
    proj_fk_user_num: "",
    proj_fk_dpart_num: "",
    proj_members: "",
    proj_startdate: "",
    proj_enddate: "",
    proj_import: "",
    proj_status: "",
    proj_desc: "",
    proj_fk_comp_num: 1
  });

  // 입력값 변경될 때마다 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 폼 제출시 실행 (현재는 실제 API 호출 없이 콘솔 로그로만 처리)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    console.log("Submitted formData:", formData);
    console.log("Response data from server:", projPkNum);
    console.log("Navigating to:", `/board/projread/${projPkNum}`);

    // API 호출
    try {
      // "" 실제 서버의 URL
      const response = await axios.post("/board/projadd", formData);

      const projPkNum = response.data; 
      console.log("프로젝트 생성 성공:", projPkNum);

      toast.success("프로젝트가 성공적으로 등록되었습니다!");

      // 프로젝트 상세 페이지로 이동
      navigate(`/board/projread/${projPkNum}`);
    } catch (error) {
      console.error("프로젝트 생성 실패:", error);

      toast.error("프로젝트 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 목록 버튼 클릭 시 목록으로 이동
  const handleList = () => {
    navigate("/board/projlist"); // 목록 페이지로 이동
  };

  return (
    <Row className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Col xl="6">
        <Card className="shadow rounded" style={{ borderRadius: "10px" }}>
          <CardHeader className="border-0 text-center">
            <h3 className="mb-0">프로젝트 작성</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              {/* 프로젝트명 */}
              <FormGroup row>
                <Label for="proj_name" sm={2} style={{ fontSize: "14px", fontWeight: "bold" }}>
                  프로젝트명
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    name="proj_name"
                    id="proj_name"
                    value={formData.proj_name}
                    onChange={handleInputChange}
                    required
                    placeholder="프로젝트명을 입력하세요"
                  />
                </Col>
              </FormGroup>

              {/* 작성자 */}
              <FormGroup row>
                <Label for="proj_fk_user_num" sm={2} style={{ fontSize: "14px", fontWeight: "bold" }}>
                  작성자
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    name="proj_fk_user_num"
                    id="proj_fk_user_num"
                    value={formData.proj_fk_user_num}
                    onChange={handleInputChange}
                    required
                    placeholder="작성자를 입력하세요"
                  />
                </Col>
              </FormGroup>

              {/* 담당부서 */}
              <FormGroup row>
                <Label for="proj_fk_dpart_num" sm={2} style={{ fontSize: "14px", fontWeight: "bold" }}>
                  담당부서
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    name="proj_fk_dpart_num"
                    id="proj_fk_dpart_num"
                    value={formData.proj_fk_dpart_num}
                    onChange={handleInputChange}
                    required
                    placeholder="담당부서를 입력하세요"
                  />
                </Col>
              </FormGroup>

              {/* 담당자 */}
              <FormGroup row>
                <Label for="proj_members" sm={2} style={{ fontSize: "14px", fontWeight: "bold" }}>
                  담당자
                </Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    name="proj_members"
                    id="proj_members"
                    value={formData.proj_members}
                    onChange={handleInputChange}
                    required
                    placeholder="담당자를 입력하세요"
                  />
                </Col>
              </FormGroup>

              {/* 회사번호 */}
              <Input
                type="hidden"
                name="proj_fk_comp_num"
                id="proj_fk_comp_num"
                value={formData.proj_fk_comp_num}
                onChange={handleInputChange}
                required
              />

              {/* 시작일 */}
              <FormGroup row>
                <Label for="proj_startdate" sm={2} style={{ fontSize: "14px", fontWeight: "bold" }}>
                  시작일
                </Label>
                <Col sm={10}>
                  <Input
                    type="date"
                    name="proj_startdate"
                    id="proj_startdate"
                    value={formData.proj_startdate}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
              </FormGroup>

              {/* 종료일 */}
              <FormGroup row>
                <Label for="proj_enddate" sm={2} style={{ fontSize: "14px", fontWeight: "bold" }}>
                  종료일
                </Label>
                <Col sm={10}>
                  <Input
                    type="date"
                    name="proj_enddate"
                    id="proj_enddate"
                    value={formData.proj_enddate}
                    onChange={handleInputChange}
                    required
                  />
                </Col>
              </FormGroup>

              {/* 우선순위 */}
              <FormGroup row>
                <Label for="proj_import" sm={2} style={{ fontSize: "14px", fontWeight: "bold" }}>
                  우선순위
                </Label>
                <Col sm={10}>
                  <div className="custom-select-wrapper">
                    <Input
                      type="select"
                      name="proj_import"
                      id="proj_import"
                      value={formData.proj_import}
                      onChange={handleInputChange}
                      required
                      className="custom-select"
                    >
                      <option value="">선택하세요</option>
                      <option value="낮음">낮음</option>
                      <option value="보통">보통</option>
                      <option value="중요">중요</option>
                      <option value="긴급">긴급</option>
                    </Input>
                  </div>
                </Col>
              </FormGroup>

              {/* 상태 */}
              <FormGroup row>
                <Label for="proj_status" sm={2} style={{ fontSize: "14px", fontWeight: "bold" }}>
                  상태
                </Label>
                <Col sm={10}>
                  <Input
                    type="select"
                    name="proj_status"
                    id="proj_status"
                    value={formData.proj_status}
                    onChange={handleInputChange}
                    required
                    className="custom-select"
                  >
                    <option value="">선택하세요</option>
                    <option value="예정">예정</option>
                    <option value="계획">계획</option>
                    <option value="진행중">진행중</option>
                  </Input>
                </Col>
              </FormGroup>

              {/* 내용 */}
              <FormGroup row>
                <Label for="proj_desc" sm={2} style={{ fontSize: "14px", fontWeight: "bold" }}>
                  내용
                </Label>
                <Col sm={10}>
                  <Input
                    type="textarea"
                    name="proj_desc"
                    id="proj_desc"
                    value={formData.proj_desc}
                    onChange={handleInputChange}
                    required
                    placeholder="프로젝트 내용을 입력하세요"
                  />
                </Col>
              </FormGroup>

              {/* 제출 버튼 */}
              <FormGroup row>
                <Col sm={{ size: 1.5, offset: 5 }} className="text-center">
                  <Button color="primary" type="submit" block>
                    저장
                  </Button>
                </Col>
                &nbsp;
                <Col sm={{ size: 1.5 }} className="text-center">
                  <Button color="primary" type="button" onClick={handleList} block>
                    목록
                  </Button>
                </Col>
              </FormGroup>
            </form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ProjCreate;
