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
        <Route path="/" element={<FileList />} />
        <Route path="/create" element={<FileCreate />} />
        <Route path="/detail/:filePkNum" element={<FileDetail />} />
        <Route path="/update/:filePkNum" element={<FileUpdate />} />
      </Routes>
    </div>
  );
};

export default FileHome;