import ProjList from "./projList";
import { Route, Routes, useNavigate } from "react-router-dom";
import ProjCreate from "./projCreate";
import ProjRead from "./projRead";
import ProjUpdate from "./projUpdate";

const ProjectHome = () => {
  const navigate = useNavigate();
  const navigateToProjList = () =>{
    navigate("/main/proj/projlist");
  }
  return (
    <div>
 
     <Routes>
       {/* /home/proj */}
          <Route path="/projlist" element={<ProjList />} />
          <Route path="/projadd" element={<ProjCreate />} />
          <Route path="/projread/:projPkNum" element={<ProjRead />} />
       
          <Route path="/projedit/:projPkNum" element={<ProjUpdate />} />
    </Routes>
    </div>
  );
};

export default ProjectHome;
