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
import ConfirmModal from "./ConfirmModal";
import NotiToast, { showToast } from "../../../variables/Toast/NotiToast";
import axiosInstance from "../../../api/axiosInstance";

const NotiUpdate = () => {
  const navigate = useNavigate();
  const { notiPkNum } = useParams(); // URL에서 projPkNum 가져오기
  const [modalOpen, setModalOpen] = useState(false); // 확인/취소용 modal창 열림 닫힘 상태 관리

  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
    
  const userInfo = JSON.parse(userInfoFromRoot);
  const compPkNum = userInfo.user_fk_comp_num; //sessionStorage에서 로그인 된 회사번호 받아오기
  const loginUser = userInfo.user_pk_num; //sessionStorage에서 로그인 유저 받아오기

  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    noti_title: "", // 공지 제목
    noti_content: "", //공지 내용
    noti_import: 0, // 공지 중요도 체크
  });

  //기존 등록된 공지 제목 글 불러오기
  useEffect(() => {
    const fetchNotiData = async () => {
      try {
        const response = await axiosInstance.get(
          `/conect/main/${compPkNum}/notice/${notiPkNum}`,
          {
            params: {
              userPkNum: loginUser, // 조회수 기능을 위한 로그인한 사용자 ID 전달
            },
          }
        );
        const notiData = response.data;

        // 작성자 검증
        if (notiData.noti_fk_user_num !== loginUser) {
          showToast.fail(); //토스트 알림 작성자 불일치
          setTimeout(() => {
            navigate("/main/noti/notilist");
          }, 2000);
          return;
        }

        // 받아온 데이터로 폼 데이터 설정
        setFormData({
          noti_title: notiData.noti_title,
          noti_content: notiData.noti_content,
          noti_import: notiData.noti_import,
        });
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    if (notiPkNum) {
      fetchNotiData();
    }
  }, [notiPkNum, compPkNum, loginUser]);

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
      noti_import: prevData.noti_import === 1 ? 0 : 1,
    }));
  };

  // 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(
        `/conect/main/${compPkNum}/notice/update/${notiPkNum}`,
        formData
      );
      showToast.update(); //업데이트 토스트 창
      setTimeout(() => {
        navigate("/main/noti/notilist");
      }, 2000);
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // 목록 버튼 클릭 시 작업 취소하고 목록으로 이동
  const handleCancel = () => {
    navigate("/main/noti/notilist");
  };

  return (
    <>
      <Card
        className="shadow rounded"
        style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}
      >
        <CardHeader className="border-1">
          <h2 className="mb-0">공지 수정</h2>
        </CardHeader>

        <CardBody
          style={{ maxHeight: "calc(100vh - 310px)", overflowY: "auto" }}
        >
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
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
                    onClick={openModal}
                  >
                    목록
                  </Button>
                </Col>
              </Row>
            </div>
          </form>
        </CardBody>
      </Card>
      {/*Modal 창*/}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={handleCancel}
        title="목록 이동"
        message="목록 페이지로 이동하시겠습니까? 작성 중인 내용은 저장되지 않습니다."
      />
      <NotiToast />
    </>
  );
};

export default NotiUpdate;
