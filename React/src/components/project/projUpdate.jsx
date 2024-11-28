import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";  // useParams를 사용해 URL 파라미터를 가져옴

const ProjUpdate = () => {
  const navigate = useNavigate();
  // const {  } = useParams(); 

  // 상태 관리
  const [formData, setFormData] = useState({
    proj_name: "",
    proj_fk_user_num: "",
    proj_fk_dpart_num: "",
    proj_members: "",
    proj_import: "",
    proj_status: "",
    proj_desc: "",
  });

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(``);  // 프로젝트 ID로 데이터를 조회
        setFormData(response.data);  // 불러온 데이터를 상태에 설정
      } catch (error) {
        console.error("프로젝트 불러오기 실패 : ", error);
      }
    };
    fetchData();
  }, );  //[] projpknum 넣기

  // 입력값 변경 처리
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 폼 제출시 실행
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(``, formData);
      console.log("프로젝트 수정 성공:", response.data);
      navigate("/board/proj/list");  // 수정 후 목록 페이지로 이동
    } catch (error) {
      console.error("프로젝트 수정 실패:", error);
    }
  };

  // 취소 버튼 클릭 시 목록으로 이동
  const handleCancel = () => {
    navigate("/board/proj/list");  // 목록 페이지로 이동
  };

  return (
    <div>
      <h2>프로젝트 수정</h2> {/* 폼 제목 */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>프로젝트명</label>
          <input
            type="text"
            name="proj_name"
            value={formData.proj_name}
            onChange={handleEditChange}
            required
          />
        </div>
        <div>
          <label>작성자</label>
          <input
            type="text"
            name="proj_fk_user_num"
            value={formData.proj_fk_user_num}
            onChange={handleEditChange}
            required
          />
        </div>
        <div>
          <label>담당부서</label>
          <input
            type="text"
            name="proj_fk_dpart_num"
            value={formData.proj_fk_dpart_num}
            onChange={handleEditChange}
            required
          />
        </div>
        <div>
          <label>담당자</label>
          <input
            type="text"
            name="proj_members"
            value={formData.proj_members}
            onChange={handleEditChange}
            required
          />
        </div>
        <div>
          <label>우선순위</label>
          <select
            name="proj_import"
            value={formData.proj_import}
            onChange={handleEditChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="낮음">낮음</option>
            <option value="보통">보통</option>
            <option value="중요">중요</option>
            <option value="긴급">긴급</option>
          </select>
        </div>
        <div>
          <label>상태</label>
          <select
            name="proj_status"
            value={formData.proj_status}
            onChange={handleEditChange}
            required
          >
            <option value="">선택하세요</option>
            <option value="예정">예정</option>
            <option value="진행중">진행중</option>
            <option value="완료">완료</option>
          </select>
        </div>
        <div>
          <label>내용</label>
          <textarea
            name="proj_desc"
            value={formData.proj_desc}
            onChange={handleEditChange}
            required
          ></textarea>
        </div>
        <button type="submit">수정 완료</button>
        <button type="button" onClick={handleCancel}>취소</button>
      </form>
    </div>
  );
};

export default ProjUpdate;