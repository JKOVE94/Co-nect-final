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
// import { toast } from 'react-toastify'; // react-toastify 임포트
// import 'react-toastify/dist/ReactToastify.css'; // 스타일시트 임포트

const ProjCreate = () => {
  const navigate = useNavigate();
  const { projPkNum } = useParams(); // URL에서 projPkNum 가져오기

  // 프로젝트 입력 폼 상태 초기화
  const [formData, setFormData] = useState({
    proj_name: "", // 프로젝트명
    proj_fk_user_num: "", // 작성자
    proj_fk_dpart_num: "", // 담당부서
    proj_members: "", // 담당자
    proj_startdate: "", // 시작일
    proj_enddate: "", // 종료일
    proj_import: "", // 우선순위
    proj_status: "", // 상태
    proj_desc: "", // 내용
    proj_fk_comp_num: 1, // 회사번호 (기본값 1)
  });

  // 입력값이 변경될 때마다 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 폼 제출 시 실행 (현재는 실제 API 호출 없이 콘솔 로그로만 처리)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData); // 폼 데이터 출력
    console.log("Submitted formData:", formData);
    console.log("Response data from server:", projPkNum); // 서버에서 응답 받은 프로젝트 번호
    console.log("Navigating to:", `/board/projread/${projPkNum}`); // 이동할 페이지

    // API 호출
    try {
      // 실제 서버의 URL로 변경 필요
      const response = await axios.post("/proj/projadd", formData); // 프로젝트 추가 요청

      const projPkNum = response.data; // 서버에서 받은 프로젝트 번호
      console.log("프로젝트 생성 성공:", projPkNum);

      // toast.success("프로젝트가 성공적으로 등록되었습니다!"); // 성공 알림

      // 프로젝트 상세 페이지로 이동
      navigate(`/main/proj/projread/${projPkNum}`);
    } catch (error) {
      console.error("프로젝트 생성 실패:", error);

      // toast.error("프로젝트 생성에 실패했습니다. 다시 시도해주세요."); // 실패 알림
    }
  };

  // 목록 버튼 클릭 시 목록으로 이동
  const handleList = () => {
    navigate("/main/proj/projlist"); // 목록 페이지로 이동
  };

  return (
    <Row className="d-flex justify-content-center align-items-center" >
      <Col lg="11" md="20" sm="11">
        <Card className="shadow rounded" style={{ borderRadius: "10px", maxHeight: "65vh", overflowY: "auto" , display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
          <CardHeader className="border-0 text-center">
            <h3 className="mb-0">프로젝트 작성</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              {/* 프로젝트명 입력 */}
              
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
              

              {/* 작성자 입력 */}
              
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
              

              {/* 담당부서 입력 */}
              
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
              

              {/* 담당자 입력 */}
              
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
              

              {/* 회사번호 (숨겨진 필드) */}
              <Input
                type="hidden"
                name="proj_fk_comp_num"
                id="proj_fk_comp_num"
                value={formData.proj_fk_comp_num}
                onChange={handleInputChange}
                required
              />

              {/* 시작일 입력 */}
              
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
              

              {/* 종료일 입력 */}
              
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
              

              {/* 우선순위 선택 */}
              
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
              

              {/* 상태 선택 */}
             
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
              

              {/* 내용 입력 */}
              
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

              {/* 버튼들 */}
              <Row form>
            <Col sm={6} className="text-center">
              <Button color="secondary" block onClick={handleList}>
                목록
              </Button>
            </Col>
            <Col sm={6} className="text-center">
              <Button color="primary" block type="submit">
                저장
              </Button>
            </Col>
          </Row>
            </form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ProjCreate;
