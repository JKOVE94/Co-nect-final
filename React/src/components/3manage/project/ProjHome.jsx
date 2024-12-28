import ProjList from "./ProjList";
import { Route, Routes, useNavigate, userNavigate } from "react-router-dom";
import ProjCreate from "./ProjCreate";
import ProjDetail from "./ProjDetail";
import ProjUpdate from "./ProjUpdate";
import ProjAddMember from "./ProjAddMember";
import "./manageProject.css";

const ProjHome = () => {
  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userPkNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num;
  // console.log("projHome userInfo: ", userInfo);
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<ProjList compNum={compNum} userInfo={userInfo} />}
        />
        <Route path="/create" element={<ProjCreate compNum={compNum} />} />
        <Route
          path="/detail/:projPkNum"
          element={<ProjDetail compNum={compNum} userInfo={userInfo} />}
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
