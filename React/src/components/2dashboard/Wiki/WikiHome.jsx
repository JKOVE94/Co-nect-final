import WikiList from "./WikiList";
import { Route, Routes, useNavigate } from "react-router-dom";
import WikiCreate from "./WikiCreate";
import WikiUpdate from "./WikiUpdate";
import WikiDetail from "./WikiDetail.jsx";
import { useEffect } from "react";

const WikiHome = (props) => {
  const navigate = useNavigate();
  const navigateToWikiList = () => {
    navigate("/main/wiki");
  };

  return (
    <div>
      <Routes>
        {/* /main/wiki/wikilist */}
        <Route
          path="/wikilist"
          element={<WikiList projPkNum={props.projPkNum} />}
        />
        <Route
          path="/wikiadd"
          element={<WikiCreate projPkNum={props.projPkNum} />}
        />
        <Route path="/wikidetail/:wikiPkNum" element={<WikiDetail />} />
        <Route path="/wikiedit/:wikiPkNum" element={<WikiUpdate />} />
      </Routes>
    </div>
  );
};

export default WikiHome;
