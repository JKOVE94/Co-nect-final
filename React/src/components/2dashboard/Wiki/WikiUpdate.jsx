import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter } from "react-bootstrap";
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

const WikiUpdate = () => {
  const navigate = useNavigate();
  const { wikiPkNum } = useParams();
  const [fileName, setFileName] = useState(""); 
  const [showModal, setShowModal] = useState(false); 
  const [modalMessage, setModalMessage] = useState(""); 

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
    originalFile: null,  // 기존 파일 정보
    newFile: null,       // 새로 선택된 파일
    fileName: ""         // 현재 표시할 파일 이름
  });

  useEffect(() => {
    const fetchWikiData = async () => {
      try {
        const response = await axios.get(`/wiki/wikidetail/${wikiPkNum}`);
        const wikiData = response.data;

        const regdate = new Date(wikiData.wiki_regdate)
          .toISOString()
          .split("T")[0];

        setFormData({
          ...wikiData,
          wiki_regdate: regdate,
        });

        // 파일 상태 초기화
        if (wikiData.file_name) {
          setFileState({
            originalFile: wikiData.file_name,
            newFile: null,
            fileName: wikiData.file_name
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
  
    if (type === 'file') {
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

  // 파일 제거 핸들러
  const handleFileRemove = () => {
    setFileState({
      originalFile: null,
      newFile: null,
      fileName: ""
    });
    setFormData(prev => ({
      ...prev,
      fileInput: null,
      fileName: ""
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
      setModalMessage(`이미 선택된 파일이 있습니다. 한 개의 파일만 선택해주세요.`);
      setShowModal(true);
    } else {
      document.getElementById("fileInput").click(); // 파일 선택 창 열기
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    // 기본 폼 데이터 추가
    Object.keys(formData).forEach(key => {
      if (key !== 'fileInput' && key !== 'fileName') {
        data.append(key, formData[key] !== null ? String(formData[key]) : "");
      }
    });
    // 파일 관련 데이터 추가
    if (fileState.newFile) {
      data.append('fileInput', fileState.newFile);
      data.append('fileName', fileState.fileName);
    } else if (fileState.originalFile) {
      data.append('originalFileName', fileState.originalFile);
    }
    // 파일 삭제 여부 플래그 추가
    data.append('fileDeleted', (!fileState.newFile && !fileState.originalFile) ? 'true' : 'false');
    try {
      const response = await axios.put(`/wiki/wikiedit/${wikiPkNum}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/main/wiki/wikidetail/${wikiPkNum}`, {
        state: { actionType: "update" },
      });
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  const handleCancel = () => {
    navigate("/main/wiki/wikilist");
  };

  return (
    <Card className="shadow rounded" style={{ marginTop: "20px", marginLeft: "15px", marginRight: "15px" }}>
      <CardHeader className="border-1">
        <h2 className="mb-0">문서 수정</h2>
      </CardHeader>

      <CardBody style={{ maxHeight: "calc(100vh - 310px)", overflowY: "auto" }}>
        <form onSubmit={handleSubmit}>
          {/* 제목 입력 */}
          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label for="wiki_title" sm={2} style={{ fontSize: "14px", fontWeight: "bold" }}>
              제목
            </Label>
            <Col sm={10}>
              <Input type="text" name="wiki_title" id="wiki_title" value={formData.wiki_title} onChange={handleEditChange} required />
            </Col>
          </FormGroup>

          {/* 내용 입력 */}
          <FormGroup row style={{ height: "10%", marginBottom: "12px" }}>
            <Label for="wiki_content" sm={2} style={{ fontSize: "14px", fontWeight: "bold" }}>
              내용
            </Label>
            <Col sm={10}>
              <Input type="textarea" name="wiki_content" id="wiki_content" value={formData.wiki_content} onChange={handleEditChange} required placeholder="입력하세요" />
            </Col>
          </FormGroup>

          {/* 파일 선택 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Label check style={{ fontSize: "14px", fontWeight: "bold" }}>
                중요 여부
              </Label>
              <Checkbox name="wiki_isnotice" checked={formData.wiki_isnotice} onChange={() => setFormData(prev => ({ ...prev, wiki_isnotice: !prev.wiki_isnotice }))} />
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
              <p style={{ fontSize: "12px", color: "#888", textAlign: "right" }}>
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
              <p style={{ fontSize: "12px", color: "#888", textAlign: "right" }}>
                (한 번에 하나의 파일만 업로드할 수 있습니다.<br />
                여러 파일을 업로드하려면 압축파일(.zip)으로 묶어서 등록해주세요.)
              </p>
            )}
            <Row form style={{ display: "flex", justifyContent: "flex-end" }}>
              <Col sm={1.5} className="text-center">
                <Button className="btn btn-primary" style={{ backgroundColor: "#007bff", borderColor: "#007bff", color: "white" }} block type="submit">
                  수정
                </Button>
              </Col>
              <Col sm={1.5} className="text-center">
                <Button style={{ backgroundColor: "#696969", borderColor: "#696969", color: "white" }} block onClick={handleCancel}>
                  목록
                </Button>
              </Col>
            </Row>
          </div>
        </form>
      </CardBody>

      {/* 모달 컴포넌트 수정 */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body style={{ textAlign: "center" }}>{modalMessage}</Modal.Body>
        <Modal.Footer style={{ justifyContent: "center" }}>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};


export default WikiUpdate;
