import FreeList from "./FreeList";
import { Route, Routes, useNavigate, userNavigate } from "react-router-dom";
import FreeCreate from "./FreeCreate";
import FreeDetail from "./FreeDetail";

import FreeUpdate from "./FreeUpdate";

const FreeHome = () => {
  const navi = useNavigate();
  const move = () =>{
    navi("/main/free/list");
  }
  return (
    <div>
     <Routes>
          <Route path="/" element={<FreeList />} />
          <Route path="/create" element={<FreeCreate />} />
          <Route path="/detail/:postPkNum" element={<FreeDetail />} />
          <Route path="/update/:postPkNum" element={<FreeUpdate />} />
    </Routes>
    </div>
  );
};

export default FreeHome;