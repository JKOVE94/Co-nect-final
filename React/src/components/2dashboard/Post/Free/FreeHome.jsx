
import FreeList from "./FreeList";
import { Route, Routes, useNavigate, userNavigate } from "react-router-dom";
import FreeCreate from "./FreeCreate";
import FreeDetail from "./FreeDetail";
import FreeDelete from "./FreeDelete";
import FreeUpdate from "./FreeUpdate";

const FreeHome = () => {
  const navi = useNavigate();
  const move = () =>{
    navi("/main/free/list");
  }
  return (
    <div>
 
     <Routes>
        {/* /home/free */}

       {/* /home/free/create */}
          <Route path="/" element={<FreeList />} />
          <Route path="/create" element={<FreeCreate />} />
          <Route path="/detail/:postPkNum" element={<FreeDetail />} />
          <Route path="/delete" element={<FreeDelete />} />
          <Route path="/update" element={<FreeUpdate />} />
    </Routes>
    </div>
  );
};

export default FreeHome;
