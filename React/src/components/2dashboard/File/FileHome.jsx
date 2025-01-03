import { Route, Routes } from "react-router-dom";
import FileCreate from "./FileCreate";
import FileList from "./FileList";
import FileUpdate from "./FileUpdate";
import FileDetail from "./FileDetail";

const FileHome = (props) => {
  return (
    <div>
      {/* 파일공유 관련 화면들의 라우팅 설정 */}
      <Routes>
        <Route path="/" element={<FileList projPkNum={props.projPkNum} />} />
        <Route
          path="/create"
          element={<FileCreate projPkNum={props.projPkNum} />}
        />
        <Route
          path="/detail/:filePkNum"
          element={<FileDetail projPkNum={props.projPkNum} />}
        />
        <Route
          path="/update/:filePkNum"
          element={<FileUpdate projPkNum={props.projPkNum} />}
        />
      </Routes>
    </div>
  );
};

export default FileHome;
