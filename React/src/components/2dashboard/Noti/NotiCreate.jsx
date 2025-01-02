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
import ConfirmModal from "./ConfirmModal";
import NotiToast, { showToast } from "../../../variables/Toast/NotiToast";
import axiosInstance from "../../../api/axiosInstance";

const NoticeCreate = (props) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false); // 확인/취소용 modal창 열림 닫힘 상태 관리

  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;

  const userInfo = JSON.parse(userInfoFromRoot);
  const compPkNum = userInfo.user_fk_comp_num; //sessionStorage에서 로그인 된 회사번호 받아오기
  const writer = userInfo.user_pk_num; //sessionStorage에서 로그인 유저 받아오기

  // Notice 입력 폼 상태 초기화
  const [formData, setFormData] = useState({
    noti_title: "", // 제목
    noti_content: "", // 내용
    noti_fk_proj_num: props.projPkNum, // 프로젝트 번호_url 전달 값 받아오기
    noti_fk_user_num: writer, // 로그인 된 작성자 번호
    noti_import: 0, // 중요도 체크 (기본값 0)
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
    // console.log("전송할 데이터:", formData);

    try {
      await axiosInstance.post(
        `/conect/main/${compPkNum}/notice/insert`,
        formData
      );
      // 등록 성공 시 리스트 페이지로 리다이렉트
      showToast.create(); //토스트 창 생성(문서가 등록되었습니다.)
      setTimeout(() => {
        //navigation 시간 조정 2초뒤
        navigate("/main/noti/notilist");
      }, 2000);
    } catch (error) {
      console.error("공지사항 등록 실패:", error);
    }
  };

  // 목록으로 이동
  const handleList = () => {
    setModalOpen(true); //Modal창 열림
  };

  //Modal창 닫는 함수
  const closeModal = () => {
    setModalOpen(false); //Modal창 닫힘
  };

  //Modal창 확인 시 실행되는 함수
  const confirmMove = () => {
    navigate("/main/noti/notilist"); //Modal창 확인 시 목록보기로 이동
  };

  return (
    <>
      <Card
        className="shadow rounded"
        style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}
      >
        <CardHeader className="border-1">
          <h2 className="mb-0">공지사항 등록</h2>
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
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "20px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
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
      {/*Modal 창*/}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={closeModal}
        onConfirm={confirmMove}
        title="목록 이동"
        message="목록 페이지로 이동하시겠습니까? 작성 중인 내용은 저장되지 않습니다."
      />
      <NotiToast />
    </>
  );
};

export default NoticeCreate;
