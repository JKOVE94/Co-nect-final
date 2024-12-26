import ProjList from "./ProjList";
import { Route, Routes, useNavigate, userNavigate } from "react-router-dom";
import ProjCreate from "./ProjCreate";
import ProjDetail from "./ProjDetail";
import ProjUpdate from "./ProjUpdate";
import ProjAddMember from "./ProjAddMember";
import "./manageProject.css";

const ProjHome = () => {
  const compNum = JSON.parse(
    sessionStorage.getItem("persist:userInfo")
  ).user_fk_comp_num;
  return (
    <div>
      <Routes>
        <Route path="/" element={<ProjList compNum={compNum} />} />
        <Route path="/create" element={<ProjCreate compNum={compNum} />} />
        <Route
          path="/detail/:projPkNum"
          element={<ProjDetail compNum={compNum} />}
        />
        <Route
          path="/update/:projPkNum"
          element={<ProjUpdate compNum={compNum} />}
        />
        <Route
          path="/addMember/:projPkNum/:projName"
          element={<ProjAddMember compNum={compNum} />}
        />
      </Routes>
    </div>
  );
};

export default ProjHome;
