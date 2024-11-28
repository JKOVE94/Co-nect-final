import React, { useState } from "react";
import { useNavigate } from "react-router";
//import '../../assets/css/'

const ProjCreate = () => {
  console.log("ProjCreate 컴포넌트 렌더링됨");

  const [formData, setFormData] = useState({
    proj_name: "",
    proj_fk_user_num: "",
    proj_fk_dpart_num: "",
    proj_members: "",
    proj_import: "",
    proj_status: "",
    proj_desc: "",
  });

  // 입력값 변경될 때마다 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 폼 제출시 실행 (현재는 실제 API 호출 없이 콘솔 로그로만 처리)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    // 실제 API 호출 부분은 나중에 추가하면 됨
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
            type="text"
            name="proj_name"
            value={formData.proj_name}
            onChange={handleInputChange}
            required
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
            name="proj_import"
            value={formData.proj_import}
            onChange={handleInputChange}
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
            name="proj_desc"
            value={formData.proj_desc}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit">저장</button> {/* 폼 제출 버튼 */}
      </form>
    </div>
  );
};

export default ProjCreate;