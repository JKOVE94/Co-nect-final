import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../api/axiosInstance";

const FileCreate = () => {
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userName = userInfo.user_name; // 유저 이름
  const userPkNum = userInfo.user_pk_num; // 유저 ID

  const compNum = userInfo.user_fk_comp_num; // 회사 번호
  const projNum = sessionStorage.getItem("persist:proj_pk_num"); // 프로젝트 번호

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    wiki_title: "",
    wiki_content: "",
    wiki_fk_user_num: userPkNum,
    wiki_fk_proj_num: 1,
    wiki_isnotice: false,
    file: null,
    file_name: "",
    file_size: 0,
    file_type: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxFileSize = 10 * 1024 * 1024; // 10MB 제한
    const allowedExtensions = [
      "png",
      "jpg",
      "jpeg",
      "xlsx",
      "xls",
      "hwp",
      "doc",
      "docx",
      "pdf",
      "zip",
    ]; // 허용된 확장자
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      toast.error(
        `허용되지 않는 파일 형식입니다. 허용된 형식: ${allowedExtensions.join(
          ", "
        )}`,
        {
          autoClose: 3000,
        }
      );
      return;
    }

    if (file.size > maxFileSize) {
      toast.error("파일 크기는 10MB를 초과할 수 없습니다.", {
        autoClose: 3000,
      });
      return;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      file,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "file" && formData.file) {
        data.append(key, formData.file);
      } else if (key !== "file") {
        data.append(key, formData[key]);
      }
    });

    data.append("user_name", userName);

    try {
      const response = await axiosInstance.post(
        `/conect/${compNum}/file/${projNum}`,
        data
      );

      if (response.data) {
        toast.success("파일이 성공적으로 업로드되었습니다!", {
          autoClose: 2000,
        });
        setTimeout(() => navigate(`/main/file/detail/${response.data}`), 2000);
      } else {
        throw new Error("저장된 파일 ID가 반환되지 않았습니다.");
      }
    } catch (error) {
      console.error("파일 업로드 중 오류:", error);
      const status = error.response?.status;
      toast.error(
        `저장 중 오류가 발생했습니다.${
          status ? `\n오류 코드: ${status}` : "\n서버에 연결할 수 없습니다."
        }`,
        { autoClose: 4000 }
      );
    }
  };

  const handleBackToList = () => navigate("/main/file");

  return (
    <Container fluid style={{ marginTop: "2em" }}>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable
      />
      <Card>
        <CardHeader>
          <h2>새 파일 등록</h2>
        </CardHeader>
        <CardBody style={{ maxHeight: "40em", overflowY: "auto" }}>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="wiki_title">제목:</label>
              <input
                type="text"
                className="form-control"
                id="wiki_title"
                name="wiki_title"
                value={formData.wiki_title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="wiki_content">내용:</label>
              <textarea
                className="form-control"
                id="wiki_content"
                name="wiki_content"
                value={formData.wiki_content}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="file">파일 첨부:</label>
              <input
                type="file"
                className="form-control"
                id="file"
                name="file"
                onChange={handleFileChange}
                required
              />
              <small className="text-muted">
                ✔️허용된 파일 형식: png, jpg, jpeg, xlsx, xls, hwp, doc, docx,
                pdf, zip (최대 10MB)
                <br />
                ✔️파일은 1개만 업로드 가능합니다.
              </small>
              {formData.file && (
                <div style={{ marginTop: "1em" }}>
                  <strong>선택한 파일:</strong> {formData.file_name}
                  <br />
                  <strong>크기:</strong>{" "}
                  {(formData.file_size / (1024 * 1024)).toFixed(2)} MB
                  <br />
                  {formData.file_type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(formData.file)}
                      alt="미리보기"
                      style={{
                        maxWidth: "300px",
                        height: "auto",
                        marginTop: "1em",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                      }}
                    />
                  )}
                </div>
              )}
            </div>
            <div className="form-group" style={{ marginTop: "1.5em" }}>
              <label htmlFor="wiki_isnotice">
                <input
                  type="checkbox"
                  id="wiki_isnotice"
                  name="wiki_isnotice"
                  checked={formData.wiki_isnotice}
                  onChange={handleChange}
                />{" "}
                중요 파일
              </label>
            </div>
            <div style={{ marginTop: "1.5em", textAlign: "right" }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  !formData.file ||
                  !formData.wiki_title ||
                  !formData.wiki_content
                }
                style={{ marginRight: "1em" }}
              >
                게시글 저장
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleBackToList}
              >
                목록
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default FileCreate;
