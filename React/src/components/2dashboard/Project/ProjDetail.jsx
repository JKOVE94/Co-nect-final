import React from "react";
import ProjHeaders from "../Headers/ProjHeaders";
import { useParams } from "react-router-dom";
import TreeAndGantt from "variables/TreeTable_Gantt/TreeAndGantt";
import ToogleSwitch from "variables/TreeTable_Gantt/ToogleSwitch";

const ProjDetail = () => {
  const { projPkNum } = useParams();
  const projPkNumInt = parseInt(projPkNum, 10); // 10진수로 변환
  // console.log("PROJ :" + projPkNumInt);
  return (
    <>
      <ProjHeaders />
      <TreeAndGantt projPkNum={projPkNumInt} />
    </>
  );
};
export default ProjDetail;
