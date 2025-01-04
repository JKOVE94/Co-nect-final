import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter } from "reactstrap";
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
import { Checkbox } from "rsuite";
import axiosInstance from "../../../api/axiosInstance";
import { FileType } from "create/lib/metadata";

const WikiUpdate = () => {
  const navigate = useNavigate();
  const { wikiPkNum } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false); // 목록 이동 확인 모달 상태
  const [originalFileName, setOriginalFileName] = useState("");

  const compPkNum = 1;
  const [formData, setFormData] = useState({
    wiki_title: "",
    wiki_fk_proj_num: "",
    wiki_fk_user_num: "",
    wiki_regdate: "",
    wiki_isnotice: false,
    wiki_content: "",
    user_name: "",
    wiki_boardtype: true,
  });

  // 파일 상태 초기화
  const [fileState, setFileState] = useState({
    originalFile: null, // 기존 파일 정보
    newFile: null, // 새로 선택된 파일
    fileName: "", // 현재 표시할 파일 이름
  });

  useEffect(() => {
    const fetchWikiData = async () => {
      try {
        const response = await axiosInstance.get(
          `/conect/${compPkNum}/wiki/wikidetail/${wikiPkNum}`
        );
        const wikiData = response.data;

        const regdate = new Date(wikiData.wiki_regdate)
          .toISOString()
          .split("T")[0];

        setFormData({
          ...wikiData,
          wiki_regdate: regdate,
        });

        setOriginalFileName(wikiData.file_name);

        // 파일 상태 초기화
        if (wikiData.file_name) {
          setFileState({
            originalFile: wikiData.file_name,
            newFile: null,
            fileName: wikiData.file_name,
          });
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchWikiData();
  }, [wikiPkNum]);

  const handleEditChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      // 파일 입력 처리
      const file = files[0];
      if (file) {
        setFileState({
          ...fileState,
          newFile: file,
          fileName: file.name,
        });
        setFormData((prev) => ({
          ...prev,
          fileInput: file,
        }));
      }
    } else {
      // 일반 텍스트 입력 처리
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileRemove = () => {
    setFileState({
      originalFile: null,
      newFile: null,
      fileName: "",
      filePath: "",
    });

    setFormData((prev) => ({
      ...prev,
      // fileStatus: "DELETE",
    }));

    // 파일 input 초기화
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // 파일 선택 시 처리 (모달 표시)
  const handleFileClick = () => {
    if (fileState.fileName) {
      setModalMessage(`등록된 파일이 있습니다. 한 개의 파일만 선택해주세요.`);
      setShowModal(true);
    } else {
      document.getElementById("fileInput").click(); // 파일 선택 창 열기
    }
  };
  useEffect(() => {
    console.log("fileState.fileName");
    console.log(!fileState.fileName);
    console.log("fileState.originalFile");
    console.log(fileState.originalFile);
  }, [fileState]);

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // 기본 폼 데이터 추가
    Object.keys(formData).forEach((key) => {
      if (key !== "fileInput" && key !== "fileName") {
        data.append(key, formData[key] !== null ? String(formData[key]) : "");
      }
    });

    // 파일 처리 상태
    if (fileState.newFile) {
      // 새 파일 업로드
      // console.log("새 파일 업로드:", fileState.newFile);
      data.append("fileInput", fileState.newFile);
      data.append("fileStatus", "REPLACE");
    } else if (originalFileName && fileState.fileName) {
      // 기존 파일 유지
      // console.log("기존 파일 유지:", fileState.originalFile);
      data.append("fileStatus", "KEEP");
      data.append("originalFileName", fileState.originalFile);
    } else if (originalFileName && !fileState.fileName) {
      // 파일 삭제
      // console.log("파일 삭제");
      data.append("fileStatus", "DELETE");
    } else {
      data.append("fileStatus", "TEXT");
    }

    try {
      const response = await axiosInstance.put(
        `/conect/${compPkNum}/wiki/wikiedit/${wikiPkNum}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate(`/main/wiki/wikidetail/${wikiPkNum}`, {
        state: { actionType: "update" },
      });
    } catch (error) {
      console.error("수정 실패:", error);
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
        <h2 className="mb-0">문서 수정</h2>
      </CardHeader>

      <CardBody style={{ maxHeight: "calc(100vh - 310px)", overflowY: "auto" }}>
        <form onSubmit={handleSubmit}>
          {/* 제목 입력 */}
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
                onChange={handleEditChange}
                required
              />
            </Col>
          </FormGroup>

          {/* 내용 입력 */}
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
                onChange={handleEditChange}
                required
                placeholder="입력하세요"
                style={{ height: "300px" }}
              />
            </Col>
          </FormGroup>

          {/* 파일 선택 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Label check style={{ fontSize: "14px", fontWeight: "bold" }}>
                중요 여부
              </Label>
              <Checkbox
                name="wiki_isnotice"
                checked={formData.wiki_isnotice}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    wiki_isnotice: !prev.wiki_isnotice,
                  }))
                }
              />
            </div>
            <div>
              <Button
                style={{
                  backgroundColor: "#696969",
                  color: "white",
                  padding: "5px 10px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  width: "auto",
                }}
                onClick={handleFileClick}
              >
                파일 선택
              </Button>
              <input
                type="file"
                id="fileInput"
                name="fileInput"
                style={{ display: "none" }}
                onChange={handleEditChange}
              />
            </div>
            {fileState.fileName && (
              <p
                style={{ fontSize: "12px", color: "#888", textAlign: "right" }}
              >
                선택된 파일: {fileState.fileName}
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
            {!fileState.fileName && (
              <p
                style={{ fontSize: "12px", color: "#888", textAlign: "right" }}
              >
                (한 번에 하나의 파일만 업로드할 수 있습니다.
                <br />
                여러 파일을 업로드하려면 압축파일(.zip)으로 묶어서
                등록해주세요.)
              </p>
            )}
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

      <Modal
        isOpen={showModal}
        onHide={() => setShowModal(false)}
        style={{
          maxWidth: "500px",
          margin: "auto",
          top: "35%",
        }}
      >
        <ModalBody style={{ textAlign: "center" }}>{modalMessage}</ModalBody>
        <ModalFooter style={{ justifyContent: "center" }}>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            닫기
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
};

export default WikiUpdate;
