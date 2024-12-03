import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { Input, Button, FormGroup, Label, Col, Card, CardBody } from "reactstrap";

const ProjEdit = () => {
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
    proj_status: undefined,
    proj_desc: "",
    proj_fk_comp_num: 1,
  });

  // API에서 데이터 불러오기
  useEffect(() => {
    console.log(projPkNum);
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`/board/projread/${projPkNum}`);
        const projectData = response.data;
  
        // 날짜 형식을 yyyy-MM-dd로 변환
        const startdate = new Date(projectData.proj_startdate).toISOString().split('T')[0];
        const enddate = new Date(projectData.proj_enddate).toISOString().split('T')[0];
  
        // 데이터 설정
        setFormData({
          ...projectData,
          proj_startdate: startdate,
          proj_enddate: enddate,
        });
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };
  
    fetchProjectData();
  }, [projPkNum]);

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
      const response = await axios.put(
        `/board/projedit/${projPkNum}`,
        formData
      ); // 수정 API 호출
      console.log("수정 성공:", response.data);
      navigate("/board/projlist"); // 수정 후 목록 페이지로 이동
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  // 취소 버튼 클릭 시 목록으로 이동
  const handleCancel = () => {
    navigate("/board/projlist");
  };

  return (
    <Card
      className="shadow rounded"
      style={{
        borderRadius: "10px",
        marginTop: "20px",
        marginLeft: "15px",
        marginRight: "15px",
      }}
    >
      <CardBody>
        <h2 className="text-center mb-4">프로젝트 수정</h2>
        <form onSubmit={handleSubmit}>
          {/* 프로젝트명 */}
          <FormGroup row>
            <Label
              for="proj_name"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              프로젝트명
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="proj_name"
                id="proj_name"
                value={formData.proj_name}
                onChange={handleEditChange}
                required
                placeholder="프로젝트명을 입력하세요"
              />
            </Col>
          </FormGroup>

          {/* 작성자 */}
          <FormGroup row>
            <Label
              for="proj_fk_user_num"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              작성자
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="proj_fk_user_num"
                id="proj_fk_user_num"
                value={formData.proj_fk_user_num}
                onChange={handleEditChange}
                required
                placeholder="작성자를 입력하세요"
              />
            </Col>
          </FormGroup>

          {/* 담당부서 */}
          <FormGroup row>
            <Label
              for="proj_fk_dpart_num"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              담당부서
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="proj_fk_dpart_num"
                id="proj_fk_dpart_num"
                value={formData.proj_fk_dpart_num}
                onChange={handleEditChange}
                required
                placeholder="담당부서를 입력하세요"
              />
            </Col>
          </FormGroup>

          {/* 담당자 */}
          <FormGroup row>
            <Label
              for="proj_members"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              담당자
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="proj_members"
                id="proj_members"
                value={formData.proj_members}
                onChange={handleEditChange}
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
                onChange={handleEditChange}
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
                onChange={handleEditChange}
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
                onChange={handleEditChange}
                required
              />
            </Col>
          </FormGroup>

          {/* 우선순위 */}
          <FormGroup row>
            <Label
              for="proj_import"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              우선순위
            </Label>
            <Col sm={10}>
              <div className="custom-select-wrapper">
                <Input
                  type="select"
                  name="proj_import"
                  id="proj_import"
                  value={formData.proj_import}
                  onChange={handleEditChange}
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
            <Label
              for="proj_status"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              상태
            </Label>
            <Col sm={10}>
              <Input
                type="select"
                name="proj_status"
                id="proj_status"
                value={formData.proj_status || ""}
                onChange={handleEditChange}
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
            <Label
              for="proj_desc"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              내용
            </Label>
            <Col sm={10}>
              <Input
                type="textarea"
                name="proj_desc"
                id="proj_desc"
                value={formData.proj_desc}
                onChange={handleEditChange}
                required
                placeholder="프로젝트 내용을 입력하세요"
              />
            </Col>
          </FormGroup>

          {/* 버튼 */}
          <FormGroup row>
            <Col sm={{ size: 2, offset: 4 }} className="text-center">
              <Button color="primary" type="submit" block>
                수정 완료
              </Button>
            </Col>
            <Col sm={{ size: 2 }} className="text-center">
              <Button
                color="primary"
                type="button"
                onClick={handleCancel}
                block
              >
                취소
              </Button>
            </Col>
          </FormGroup>
        </form>
      </CardBody>
    </Card>
  );
};

export default ProjEdit;
