import { Route, Routes } from "react-router-dom";
// import ProjectTemporaryUpdate from "./ProjectTemporaryUpdate";
import AllTemporaryList from "./AllTemporaryList";
import FreeTemporaryUpdate from "./FreeTemporaryUpdate";

const TemporaryHome = () => {
  return (
    <Routes>
      {/* 기본 경로에서 AllTemporaryList를 보여줌 */}
      <Route index element={<AllTemporaryList />} />
      {/* 개별 경로 */}
      <Route path="update/:postPkNum" element={<FreeTemporaryUpdate />} />
    {/*   <Route path="projecttemporaryupdate/:postPkNum" element={<ProjectTemporaryUpdate />} /> */}
    </Routes>
  );
};

export default TemporaryHome;