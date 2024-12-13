import { Route, Routes } from "react-router-dom";
import FileCreate from "./FileCreate"; 
import FileList from "./FileList"; 
import FileUpdate from "./FileUpdate"; 
import FileDetail from "./FileDetail"; 

const FileHome = () => {
  return (
    <div>
      {/* 파일공유 관련 화면들의 라우팅 설정 */}
      <Routes>
        {/* 기본 경로 "/"에서 파일공유 목록 표시 */}
        <Route path="/" element={<FileList />} />
        
        {/* "/create" 경로에서 파일공유 작성 화면 표시 */}
        <Route path="/create" element={<FileCreate />} />
        
        {/* "/detail/:filePkNum" 경로에서 파일공유 상세보기 화면 표시 */}
        <Route path="/detail/:filePkNum" element={<FileDetail />} />
        
        {/* "/update/:filePkNum" 경로에서 파일 수정 화면 표시 */}
        <Route path="/update/:filePkNum" element={<FileUpdate />} />
      </Routes>
    </div>
  );
};

export default FileHome;