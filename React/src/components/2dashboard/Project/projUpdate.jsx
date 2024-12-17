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

const ProjUpdate = () => {
  const navigate = useNavigate();
  const { projPkNum } = useParams(); // URL에서 projPkNum 가져오기

  const [formData, setFormData] = useState({
    proj_title: "",
    proj_fk_user_num: "",
    proj_members: "",
    proj_startdate: "",
    proj_enddate: "",
    proj_status: "",
    proj_content: "",
    proj_fk_comp_num: 1,
    user_name: "", // 작성자 이름
  });

  // 입력값이 변경될 때마다 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // API에서 데이터 불러오기
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await axios.get(`/proj/projread/${projPkNum}`);
        const projectData = response.data;

        // 날짜 형식을 yyyy-MM-dd로 변환
        const startdate = new Date(projectData.proj_startdate)
          .toISOString()
          .split("T")[0];
        const enddate = new Date(projectData.proj_enddate)
          .toISOString()
          .split("T")[0];

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
      const response = await axios.put(`/proj/projedit/${projPkNum}`, formData); // 수정 API 호출
      // console.log("수정 성공:", response.data);

      navigate(`/main/proj/projread/${projPkNum}`, {
        state: { actionType: "update" },
      }); // 수정 후 목록 페이지로 이동
    } catch (error) {
      // console.error("수정 실패:", error);
    }
  };

  // 취소 버튼 클릭 시 목록으로 이동
  const handleCancel = () => {
    navigate("/main/proj/projlist");
  };

  return (
    <Card
      className="shadow rounded"
      style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}
    >
      <CardHeader className="border-1">
        <h1 className="mb-0">프로젝트 수정</h1>
      </CardHeader>

      <CardBody style={{ maxHeight: "calc(100vh - 310px)", overflowY: "auto" }}>
        <form onSubmit={handleSubmit}>
          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="proj_title"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              프로젝트명
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="proj_title"
                id="proj_title"
                value={formData.proj_title}
                onChange={handleEditChange}
                required
                placeholder="프로젝트명을 입력하세요"
              />
            </Col>
          </FormGroup>

          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
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
                value={formData.user_name} // 이름 표시
                onChange={handleInputChange}
                required
                disabled // 사용자가 수정하지 못하도록
              />
            </Col>
          </FormGroup>

          <Input
            type="hidden"
            name="proj_fk_comp_num"
            id="proj_fk_comp_num"
            value={formData.proj_fk_comp_num}
            onChange={handleEditChange}
            required
          />

          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="proj_startdate"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
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

          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="proj_enddate"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
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

          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
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
                value={formData.proj_status}
                onChange={handleEditChange}
                required
              >
                <option value="예정">예정</option>
                <option value="계획">계획</option>
                <option value="진행중">진행중</option>
              </Input>
            </Col>
          </FormGroup>

          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="proj_content"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              내용
            </Label>
            <Col sm={10}>
              <Input
                type="textarea"
                name="proj_content"
                id="proj_content"
                value={formData.proj_content}
                onChange={handleEditChange}
                required
                placeholder="프로젝트 내용을 입력하세요"
              />
            </Col>
          </FormGroup>
          <br />
          <Row form className="justify-content-center">
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

export default ProjUpdate;
