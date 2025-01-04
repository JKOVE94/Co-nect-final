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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { Checkbox } from "rsuite";
import axiosInstance from "../../../api/axiosInstance";

const WikiCreate = (props) => {
  const navigate = useNavigate();

  const { wikiPkNum } = useParams(); // URL에서 wikiPkNum 가져오기

  const [fileName, setFileName] = useState(""); // 파일 이름 상태
  const [showModal, setShowModal] = useState(false); // 모달 상태 추가
  const [modalMessage, setModalMessage] = useState(""); // 모달 메시지 상태 추가
  const [showConfirmModal, setShowConfirmModal] = useState(false); // 목록 이동 확인 모달 상태
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const writer = userInfo.user_pk_num;
  const compPkNum = userInfo.user_fk_comp_num; //회사번호

  // 프로젝트 입력 폼 상태 초기화
  const [formData, setFormData] = useState({
    wiki_title: "", // 제목
    wiki_fk_proj_num: props.projPkNum, //프로젝트 번호
    wiki_fk_user_num: writer, // 작성자 번호
    wiki_regdate: "", // 등록일
    wiki_isnotice: false, // 공지
    wiki_content: "", // 내용
    wiki_boardtype: true,
  });

  useEffect(() => {
    // 오늘 날짜를 자동으로 설정
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
    setFormData((prevData) => ({
      ...prevData,
      wiki_regdate: formattedDate, // 등록일에 오늘 날짜 설정
    }));
  }, []);

  // 입력값이 변경될 때마다 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fileInput") {
      setFileName(files[0].name);
      // console.log(fileName);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // 공지 여부 체크박스 상태 업데이트
  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      wiki_isnotice: !prevData.wiki_isnotice,
    }));
  };

  const handleFileClick = () => {
    if (fileName) {
      // fileName을 체크하여 파일이 이미 등록되었는지 확인
      // 파일이 이미 등록된 경우 모달 띄우기
      setModalMessage(`등록된 파일이 있습니다. 한 개의 파일만 선택해주세요.`);
      setShowModal(true);
    } else {
      document.getElementById("fileInput").click(); // 파일 입력창 열기
    }
  };

  const handleFileRemove = () => {
    setFormData((prevData) => ({
      ...prevData,
      fileInput: null,
    }));
    setFileName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 객체 생성
    const data = new FormData();
    for (const key in formData) {
      if (key === "fileInput") {
        data.append(key, formData[key]); // 파일은 그대로 추가
      } else {
        data.append(key, formData[key] !== null ? String(formData[key]) : ""); // 나머지는 문자열로 변환하여 추가
      }
    }

    // 로그로 데이터를 확인
    // console.log("전송할 데이터:", formData);
    // console.log("전송할 파일:", formData.fileInput);

    try {
      // 문서와 선택적 파일 데이터를 함께 서버에 전송
      const response = await axiosInstance.post(
        `/conect/${compPkNum}/wiki/wikiadd`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // 서버로부터 반환된 wikiPkNum으로 상세 페이지 이동
      const wikiPkNum = response.data; // 서버 응답에서 문서 ID 추출

      // 상세 페이지로 이동
      navigate(`/main/wiki/wikidetail/${wikiPkNum}`, {
        state: { actionType: "create" },
      });
    } catch (error) {
      console.error("문서 생성 실패:", error);
      alert("문서 생성에 실패했습니다.");
    }
  };

  // 목록 버튼 클릭 시 모달 표시
  const handleListClick = () => {
    setShowConfirmModal(true); // 목록 이동 확인 모달 열기
  };

  // 모달에서 확인 버튼 클릭 시 목록으로 이동
  const handleConfirmList = () => {
    setShowConfirmModal(false); // 모달 닫기
    navigate("/main/wiki/wikilist"); // 목록 페이지로 이동
  };

  // 모달에서 취소 버튼 클릭 시 모달 닫기
  const handleCancelList = () => {
    setShowConfirmModal(false);
  };

  return (
    <Card
      className="shadow rounded"
      style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}
    >
      <CardHeader className="border-1">
        <h2 className="mb-0">새 글</h2>
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
                onChange={handleInputChange}
                required
              />
            </Col>
          </FormGroup>

          <Input
            type="hidden"
            name="wiki_fk_user_num"
            id="wiki_fk_user_num"
            value={writer.user_name}
            onChange={handleInputChange}
            required
            disabled
          />

          <Input
            type="hidden"
            name="wiki_regdate"
            id="wiki_regdate"
            value={formData.wiki_regdate}
            onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
                placeholder="입력하세요"
                style={{ height: "300px" }}
              />
            </Col>
          </FormGroup>

          {/* 중요 여부와 버튼들 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "10px",
            }}
          >
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
            <div>
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
                onClick={handleFileClick} // 클릭하면 파일 입력 창 열기
              >
                파일 선택
              </Button>
              <input
                type="file"
                id="fileInput"
                name="fileInput"
                style={{ display: "none" }} // 화면에는 보이지 않도록 숨김
                onChange={handleInputChange} // 파일이 선택되면 파일 상태 업데이트
              />
            </div>
            {fileName && (
              <p
                style={{ fontSize: "12px", color: "#888", textAlign: "right" }}
              >
                선택된 파일 : {fileName}
                <span
                  style={{
                    color: "red",
                    marginLeft: "10px",
                    cursor: "pointer",
                  }}
                  onClick={handleFileRemove}
                >
                  X
                </span>
              </p>
            )}
            {!fileName && (
              <p
                style={{ fontSize: "12px", color: "#888", textAlign: "right" }}
              >
                (한 번에 하나의 파일만 업로드할 수 있습니다.
                <br />
                여러 파일을 업로드하려면 압축파일(.zip)으로 묶어서
                등록해주세요.)
              </p>
            )}
            {/* 버튼들 */}
            <Row
              form
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Col
                sm={1.5}
                className="text-center"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button color="primary" type="submit">
                  등록
                </Button>
              </Col>
              <Col
                sm={1.5}
                className="text-center"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  style={{
                    backgroundColor: "#696969",
                    borderColor: "#696969",
                    color: "white",
                  }}
                  block
                  onClick={handleListClick}
                >
                  목록
                </Button>
              </Col>
              {/* 목록 이동 확인 모달 */}
              <Modal
                isOpen={showConfirmModal}
                toggle={() => setShowConfirmModal(false)}
                style={{
                  maxWidth: "500px",
                  margin: "auto", // 자동으로 중앙 정렬
                  top: "35%", // Modal을 화면 중앙에서 적당히 아래로 위치
                }}
              >
                <ModalBody style={{ textAlign: "center" }}>
                  작업 중인 내용이 사라집니다. <br />
                  그래도 목록으로 이동하시겠습니까?
                </ModalBody>
                <ModalFooter style={{ justifyContent: "center" }}>
                  <Button color="primary" onClick={handleConfirmList}>
                    확인
                  </Button>
                  <Button color="danger" onClick={handleCancelList}>
                    취소
                  </Button>
                </ModalFooter>
              </Modal>
            </Row>
          </div>
        </form>
      </CardBody>

      {/* 파일 관련 모달 */}
      <Modal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        style={{
          maxWidth: "500px", // Modal의 최대 너비 설정
          margin: "auto", // 자동으로 중앙 정렬
          top: "35%", // Modal을 화면 중앙에서 적당히 아래로 위치
        }}
      >
        <ModalBody style={{ textAlign: "center" }}>{modalMessage}</ModalBody>

        <ModalFooter style={{ justifyContent: "center" }}>
          <Button color="secondary" onClick={() => setShowModal(false)}>
            닫기
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

export default WikiCreate;
