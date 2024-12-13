import React from "react";
import { useParams } from "react-router-dom";
import TreeAndGantt from "variables/TreeTable_Gantt/TreeAndGantt"; // TreeGantt 컴포넌트

const ProjDetail = () => {
    const { projPkNum } = useParams();

    return (
        <div className="proj-detail-page">
            {/* TreeGantt 영역 */}
            <div className="tree-gantt-container">
                <h2>프로젝트 Gantt Chart</h2>
                <TreeAndGantt projPkNum={projPkNum} />
            </div>
        </div>
    );
};

export default ProjDetail;