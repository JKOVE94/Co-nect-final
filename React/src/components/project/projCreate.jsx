import React, { useState } from "react";
import { useNavigate } from "react-router";

const ProjCreate = () => {
  const [formData, setFormData] = useState({
    proj_name: "",
    proj_fk_user_num: "",
    proj_fk_dpart_num: "",
    proj_members: "",
    proj_import: "",
    proj_status: "",
    proj_desc: "",
  });

  const navigate = useNavigate();

  // 입력값 변경될 때마다 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 폼 제출시 실행
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 서버로 전송하는 API 호출
    fetch("/board/proj/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 201) {
          // 프로젝트 생성 성공
          navigate("/board/proj/list"); // 프로젝트 생성 후 목록으로 이동
        } else {
          throw new Error("등록 실패"); // 실패 시 에러 발생
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <h2>프로젝트 작성</h2> {/* 폼 제목 */}
      <form onSubmit={handleSubmit}>
        {" "}
        {/* 폼 제출 시 handleSubmit 함수 호출 */}
        <div>
          <label>프로젝트명</label>
          <input
            type="text" // 입력 필드 타입 (텍스트)
            name="proj_name" // 필드 이름 (이름 속성에 따라 상태가 업데이트됨)
            value={formData.proj_name} // 상태의 값으로 폼 입력 필드의 값 설정
            onChange={handleInputChange} // 입력값 변경 시 handleInputChange 함수 호출
            required // 이 필드는 필수 입력 필드
          />
        </div>
        <div>
          <label>작성자</label>
          <input
            type="text"
            name="proj_fk_user_num"
            value={formData.proj_fk_user_num}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>담당부서</label>
          <input
            type="text"
            name="proj_fk_dpart_num"
            value={formData.proj_fk_dpart_num}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>담당자</label>
          <input
            type="text"
            name="proj_members"
            value={formData.proj_members}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>우선순위</label>
          <select
            name="proj_import" // 선택 필드의 이름
            value={formData.proj_import} // 상태 값으로 선택된 값 설정
            onChange={handleInputChange} // 값 변경 시 상태 업데이트
            required // 필수 입력 필드
          >
            <option value="">선택하세요</option> {/* 기본 선택 옵션 */}
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
            onChange={handleInputChange}
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
            name="proj_desc" // 텍스트 영역의 이름
            value={formData.proj_desc} // 상태 값으로 내용 설정
            onChange={handleInputChange} // 값 변경 시 상태 업데이트
            required // 필수 입력 필드
          ></textarea>
        </div>
        <button type="submit">저장</button> {/* 폼 제출 버튼 */}
      </form>
    </div>
  );
};

export default ProjCreate;
