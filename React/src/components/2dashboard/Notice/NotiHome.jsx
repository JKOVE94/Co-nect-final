import NotiList from "./NotiList";
import { Route, Routes, useNavigate } from "react-router-dom";
import NotiCreate from "./NotiCreate";
import NotiUpdate from "./NotiUpdate";
import NotiDetail from "./NotiDetail.jsx";

const NotiHome = () => {
  const navigate = useNavigate();
  const navigateToNotiList = () => {
    navigate("/main/notice");
  };
  return (
    <div>
      <Routes>
        {/* /main/notice/notilist */}
        <Route path="/noticelist" element={<NotiList />} />
        <Route path="/notiadd" element={<NotiCreate />} />
        <Route path="/notidetail/:wikiPkNum" element={<NotiDetail />} />
        <Route path="/notiedit/:notiPkNum" element={<NotiUpdate />} />
      </Routes>
    </div>
  );
};

export default NotiHome;
