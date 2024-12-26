import React from "react";
import Headers from "components/2dashboard/Headers/Header";
import { useParams } from "react-router-dom";

import ToogleSwitch from "variables/TreeTable_Gantt/ToogleSwitch";
import GanttHome from "variables/Gantt/GanttHome";

const ProjDetail = () => {
  const { projPkNum } = useParams();
  const projPkNumInt = parseInt(projPkNum, 10); // 10진수로 변환
  // console.log("PROJ :" + projPkNumInt);
  return (
    <>
      <Headers />
      <GanttHome projPkNum={projPkNumInt} />
    </>
  );
};
export default ProjDetail;
