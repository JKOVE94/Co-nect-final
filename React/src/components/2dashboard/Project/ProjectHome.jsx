import ProjList from "./projList";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import ProjCreate from "./projCreate";
import ProjRead from "./projRead";
import ProjUpdate from "./projUpdate";
import ProjDetail from "./ProjDetail";

const ProjectHome = () => {
  const navigate = useNavigate();
  const navigateToProjList = () => {
    navigate(`/main/proj/projlist`);
  };
  return (
    <div>
      <Routes>
        {/* /main/proj/projdetail/:projPkNum */}
        <Route path="/projlist" element={<ProjList />} />
        <Route path="/projadd" element={<ProjCreate />} />
        <Route path="/projdetail/:projPkNum/*" element={<ProjDetail />} />
        <Route path="/projedit/:projPkNum" element={<ProjUpdate />} />
      </Routes>
    </div>
  );
};

export default ProjectHome;
