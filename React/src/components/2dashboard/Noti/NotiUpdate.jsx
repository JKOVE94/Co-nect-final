import axios from "axios"; // Axios를 사용하여 HTTP 요청을 보냄
import React, { useEffect, useState } from "react"; // React 훅 사용
import { useSelector } from "react-redux"; // Redux에서 상태를 가져오기 위한 훅
import { useNavigate, useParams } from "react-router"; // 라우팅을 위한 훅
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
} from "reactstrap"; // UI 컴포넌트
import { Checkbox } from "rsuite"; // 체크박스 컴포넌트

const NotiUpdate = () => {
  const navigate = useNavigate();
  const { notiPkNum } = useParams(); // URL에서 projPkNum 가져오기
  const projNum = 6; // 테스트 projNum
  const compPkNum = 1; // 테스트 compNum
  const loginUser = useSelector((state) => state.userData); // Redux에서 로그인한 유저 정보 가져오기

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    noti_title: "", // 공지 제목
    noti_content: "", //공지 내용
    //noti_fk_user_num: writer.user_pk_num, //작성자 로그인되어 있는 user로 변경
    noti_import: 0 // 공지 중요도 체크
  });

 //기존 등록된 공지 제목 글 불러오기
useEffect(() => {
  const fetchNotiData = async () => {
    try {
      const response = await axios.get(`/main/${compPkNum}/notice/${notiPkNum}`, {
        params: {
          userPkNum: loginUser.user_pk_num  // 조회수 기능을 위한 로그인한 사용자 ID 전달
        }
      });
      const notiData = response.data;

      // 작성자 검증
      if (notiData.noti_fk_user_num !== loginUser.user_pk_num) {
        alert("작성자가 불일치 합니다.");//modal창으로 변경 예정
        navigate("/main/noti/notilist");
        return;
      }

        // 받아온 데이터로 폼 데이터 설정
        setFormData({
          noti_title: notiData.noti_title,
          noti_content: notiData.noti_content,
          //noti_fk_user_num: writer.user_pk_num, 작성자 변경 불가능하게 변경
          noti_import: notiData.noti_import
        });
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
        alert("공지사항 정보를 불러오는데 실패했습니다.");
      }
    };

    if (notiPkNum) {
      fetchNotiData();
    }
  }, [notiPkNum, compPkNum, loginUser.user_pk_num]);

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
      noti_import: prevData.noti_import === 1 ? 0 : 1
    }));
  };

  // 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/main/${compPkNum}/notice/update/${notiPkNum}`, formData);
      alert("공지사항이 수정되었습니다.");//modal창으로 변경 예정
      navigate("/main/noti/notilist");
    } catch (error) {
      console.error("수정 실패:", error);
      alert("공지사항 수정에 실패했습니다.");
    }
  };

  // 취소 버튼 클릭 시 목록으로 이동
  const handleCancel = () => {
    navigate("/main/noti/notilist");
    alert("수정 작업이 취소 됩니다")//modal창으로 변경 예정
  };

  return (
    <Card
      className="shadow rounded"
      style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}
    >
      <CardHeader className="border-1">
        <h2 className="mb-0">공지 수정</h2>
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
                onChange={handleEditChange}
                required
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
                name="noti_import"
                checked={formData.noti_import === 1}
                onChange={handleCheckboxChange}
              />
            </div>
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