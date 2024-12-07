import FreeList from "./FreeList"; // 자유게시판 목록 화면 컴포넌트 임포트
import { Route, Routes, useNavigate } from "react-router-dom"; // React Router 관련 함수와 컴포넌트 임포트
import FreeCreate from "./FreeCreate"; // 게시글 작성 화면 컴포넌트 임포트
import FreeDetail from "./FreeDetail"; // 게시글 상세보기 화면 컴포넌트 임포트
import FreeUpdate from "./FreeUpdate"; // 게시글 수정 화면 컴포넌트 임포트

const FreeHome = () => {
  const navi = useNavigate(); // 페이지 이동을 위한 React Router의 useNavigate 훅 사용

  // 자유게시판 목록 페이지로 이동하는 함수
  const move = () => {
    navi("/main/free/list"); // "/main/free/list" 경로로 이동
  };

  return (
    <div>
      {/* 자유게시판 관련 화면들의 라우팅 설정 */}
      <Routes>
        {/* 기본 경로 "/"에서 자유게시판 목록 화면 표시 */}
        <Route path="/" element={<FreeList />} />
        
        {/* "/create" 경로에서 게시글 작성 화면 표시 */}
        <Route path="/create" element={<FreeCreate />} />
        
        {/* "/detail/:postPkNum" 경로에서 게시글 상세보기 화면 표시 */}
        <Route path="/detail/:postPkNum" element={<FreeDetail />} />
        
        {/* "/update/:postPkNum" 경로에서 게시글 수정 화면 표시 */}
        <Route path="/update/:postPkNum" element={<FreeUpdate />} />
      </Routes>
    </div>
  );
};

export default FreeHome; // FreeHome 컴포넌트를 기본 내보내기로 설정