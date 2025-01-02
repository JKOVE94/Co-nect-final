import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import axiosInstance from "api/axiosInstance";

const ProjUpdate = (props) => {
  const { projPkNum } = useParams(); // URL에서 'projPkNum'을 추출하고 숫자로 변환
  const writer = sessionStorage.getItem("persist:userInfo");
  const navigate = useNavigate();
  const [proj, setProj] = useState({
    proj_name: "",
    proj_import: "",
    proj_content: "",
    proj_targetnum: "",
    proj_updated: new Date().toISOString(),
    user_name: "",
  });

  useEffect(() => {
    // 기존 게시글 데이터 가져오기
    const fetchproj = async () => {
      try {
        const response = await axiosInstance.get(
          `/conect/${props.compNum}/manage/proj/${projPkNum}`
        );
        setProj(response.data);
      } catch (error) {
        console.error("Error fetching proj:", error);
      }
    };

    fetchproj();
  }, [projPkNum]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProj({ ...proj, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `/conect/${props.compNum}/manage/proj/${projPkNum}`,
        proj
      );
      if (response.status === 200) {
        // 수정 성공 시 상태 전달
        navigate(`/manage/proj/detail/${projPkNum}`, {
          state: { success: true },
        });
      }
    } catch (error) {
      console.error("Error updating proj:", error);
    }
  };

  const handleDitail = () => {
    // 수정하지 않고 상세보기 페이지로 이동
    navigate(-1);
  };

  const handleAddMember = () => {
    // 멤버 추가 페이지로 이동
    navigate(`/manage/proj/addMember/${projPkNum}/${proj.proj_title}`);
  };

  return (
    <Container fluid style={{ Height: "40em", marginTop: "2em" }}>
      <Card style={{ Height: "40em", overflowY: "auto" }}>
        <CardHeader>
          <h2>게시글 수정</h2>
        </CardHeader>
        <CardBody
          style={{
            maxHeight: "40em",
            overflowY: "auto",
            fontSize: "1.2rem",
            marginTop: "1em",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="proj_title">프로젝트 명:</label>
              <input
                type="text"
                className="form-control"
                id="proj_title"
                name="proj_title"
                value={proj.proj_title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="proj_manager">담당자:</label>
              <input
                type="text"
                className="form-control"
                id="proj_manager"
                name="proj_manager"
                value={proj.proj_manager}
                onChange={handleChange}
                required
                disabled // 작성자는 수정할 수 없도록 disabled 처리
              />
            </div>
            <div className="form-group">
              <label htmlFor="proj_startdate">프로젝트 시작일:</label>
              <input
                type="Date"
                className="form-control"
                id="proj_startdate"
                name="proj_startdate"
                value={proj.proj_startdate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="proj_enddate">프로젝트 마감일:</label>
              <input
                type="Date"
                className="form-control"
                id="proj_enddate"
                name="proj_enddate"
                value={proj.proj_enddate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="proj_status">프로젝트 상태:</label>
              <select
                className="form-control"
                id="proj_status"
                name="proj_status"
                value={proj.proj_status}
                onChange={handleChange}
                required
              >
                <option value="">선택하세요</option>
                <option value="계획">계획</option>
                <option value="진행중">진행중</option>
                <option value="종료">종료</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="proj_content">프로젝트 설명:</label>
              <textarea
                className="form-control"
                id="proj_content"
                name="proj_content"
                value={proj.proj_content}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddMember}
            >
              멤버 추가
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSubmit}
            >
              수정
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleDitail}
            >
              취소
            </button>
          </form>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ProjUpdate;
