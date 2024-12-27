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
import ReactMention from "variables/mention/ReactMention";

const ProjCreate = () => {
  const navigate = useNavigate();
  const { projPkNum } = useParams(); // URL에서 projPkNum 가져오기
  const writer = useSelector((state) => state.userData); // Redux에서 로그인한 유저 정보 가져오기

  //멘션
  const [userId, setUserId] = useState("");

  // 프로젝트 입력 폼 상태 초기화
  const [formData, setFormData] = useState({
    proj_title: "", // 프로젝트명
    proj_fk_user_num: writer.user_pk_num, // 작성자 번호
    proj_startdate: "", // 시작일
    proj_enddate: "", // 종료일
    proj_import: "", // 우선순위
    proj_status: "", // 상태
    proj_content: "", // 내용
    proj_fk_comp_num: 1, // 회사번호 (기본값 1),
  });

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // 부서 목록 가져오기
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("/proj/departments");
        setDepartments(response.data); // 데이터 저장
      } catch (error) {
        console.error("부서 목록 가져오기 실패:", error);
      }
    };
    fetchDepartments();
  }, []);

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
    // console.log(formData); // 폼 데이터 출력
    // console.log("Submitted formData:", formData);
    // console.log("Response data from server:", projPkNum); // 서버에서 응답 받은 프로젝트 번호
    // console.log("Navigating to:", `/main/proj/projread/${projPkNum}`); // 이동할 페이지

    // API 호출
    // try {
    //   const response = await axios.post("/proj/projadd", formData);
    //   const projPkNum = response.data;

    //   // 상태값과 함께 ProjRead로 navigate
    //   navigate(`/main/proj/projread/${projPkNum}`, {
    //     state: { actionType: "create" },
    //   });
    // } catch (error) {
    //   console.error("프로젝트 생성 실패:", error);
    //   alert("프로젝트 생성에 실패했습니다.");
    // }
  };

  // 목록 버튼 클릭 시 목록으로 이동
  const handleList = () => {
    navigate("/main/proj/projlist"); // 목록 페이지로 이동
  };

  return (
    <Card
      className="shadow rounded"
      style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}
    >
      <CardHeader className="border-1">
        <h1 className="mb-0">프로젝트 작성</h1>
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
                onChange={handleInputChange}
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
                value={writer.user_name}
                onChange={handleInputChange}
                required
                disabled
                placeholder="작성자를 입력하세요"
              />
            </Col>
          </FormGroup>

          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="proj_fk_dpart_num"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              담당부서
            </Label>
            <Col sm={10}>
              <Input
                type="select"
                name="proj_fk_dpart_num"
                id="proj_fk_dpart_num"
                value={formData.proj_fk_dpart_num} // 이 값은 부서 번호
                onChange={handleInputChange}
                required
              >
                <option value="">부서를 선택하세요</option>
                {departments.map((dept) => (
                  <option key={dept.dpart_pk_num} value={dept.dpart_pk_num}>
                    {" "}
                    {/* dpart_num 사용 */}
                    {dept.dpart_name}
                  </option>
                ))}
              </Input>
            </Col>
          </FormGroup>

          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label
              for="proj_members"
              sm={2}
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              담당자
            </Label>
            <Col sm={10}>
              {/* <Input
                type="text"
                name="proj_members"
                id="proj_members"
                value={formData.proj_members}
                onChange={handleInputChange}
                required
                placeholder="담당자를 입력하세요"
              /> */}
              <ReactMention
                value={formData.proj_members}
                onChange={(e) =>
                  handleInputChange({
                    target: { name: "proj_members", value: e.target.value },
                  })
                }
                text="담당자를 입력하세요"
              />
            </Col>
          </FormGroup>

          <Input
            type="hidden"
            name="proj_fk_comp_num"
            id="proj_fk_comp_num"
            value={formData.proj_fk_comp_num}
            onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
              >
                <option value="">선택하세요</option>
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
                onChange={handleInputChange}
                required
                placeholder="프로젝트 내용을 입력하세요"
              />
            </Col>
          </FormGroup>
          <br />
          {/* 버튼들 */}
          <Row form className="justify-content-center">
            <Col sm={1.5} className="text-center">
              <Button
                style={{
                  backgroundColor: "#1E90FF", // 진하면서도 생기 있는 파란색
                  borderColor: "#1E90FF", // 동일한 색상
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
                  backgroundColor: "#1E90FF", // 같은 색상
                  borderColor: "#1E90FF",
                  color: "white", // 글자 색상 흰색
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

export default ProjCreate;
