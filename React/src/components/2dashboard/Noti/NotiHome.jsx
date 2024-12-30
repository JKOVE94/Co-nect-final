import NotiList from "./NotiList";
import { Route, Routes, useNavigate } from "react-router-dom";
import NotiCreate from "./NotiCreate";
import NotiDetail from "./NotiiDetail.jsx";
import NotiUpdate from "./NotiUpdate";

const NotiHome = (props) => {
  const navigate = useNavigate();
  const navigateToNotiList = () => {
    navigate("/main/noti");
  };
  return (
    <div>
      <Routes>
        {/* /main/noti/notilist */}
        <Route
          path="/notilist"
          element={<NotiList projPkNum={props.projPkNum} />}
        />
        <Route path="/notiadd" 
        element={<NotiCreate projPkNum={props.projPkNum}/>} 
        />
        <Route path="/notidetail/:notiPkNum" element={<NotiDetail />} />
        <Route path="/notiedit/:notiPkNum" element={<NotiUpdate />} />
      </Routes>
    </div>
  );
};

export default NotiHome;
