import React from "react";
import ProjHeaders from "../Headers/ProjHeaders";
import { useParams } from "react-router-dom";
import TreeAndGantt from "variables/TreeTable_Gantt/TreeAndGantt";

const ProjDetail = () => {
  const { projPkNum } = useParams();
  console.log("PROJ :" + projPkNum);
  return (
    <>
      <ProjHeaders />
      <TreeAndGantt projPkNum={projPkNum} />
    </>
  );
};
export default ProjDetail;
