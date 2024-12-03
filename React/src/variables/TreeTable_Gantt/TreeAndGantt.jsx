import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import TreeTable from "variables/TreeTable_Gantt/TreeTable";
import Gantt from "variables/TreeTable_Gantt/Gantt";
import axios from "axios";
import "rsuite/dist/rsuite-no-reset.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

const TreeAndGantt = () => {
  const [taskdatas, setTaskdatas] = useState([]);
  const convertToTree = (data) => {
    const map = {};
    const roots = [];

    // 각 항목을 맵에 저장하고 children 배열을 추가합니다.s
    data.forEach((item) => {
      map[item.task_pk_num] = { ...item, children: [] };
    });

    // 각 항목을 순회하며 부모-자식 관계를 설정합니다.
    data.forEach((item) => {
      if (item.task_fk_task_num) {
        // 하위 업무인 경우 상위 업무의 children 배열에 추가합니다.
        map[item.task_fk_task_num].children.push(map[item.task_pk_num]);
      } else {
        // 상위 업무인 경우 roots 배열에 추가합니다.
        roots.push(map[item.task_pk_num]);
      }
    });

    return roots;
  };
  useEffect(() => {
    axios.get("/board/task/proj/1").then((response) => {
      const treeData = convertToTree(response.data);
      setTaskdatas(treeData);
    });
  }, []);

  return (
    <>
      <Link to="/main/proj/1/tree">Tree</Link> &nbsp;
      <Link to="/main/proj/1/gantt">Gantt</Link>
      <Routes>
        {/* <Route path="/proj/:proj_pk_num" element={<ManageHome />}></Route> */}
        <Route
          path="/proj/:proj_pk_num/tree"
          element={
            <TreeTable taskdatas={taskdatas} setTaskdatas={setTaskdatas} />
          }
        ></Route>
        <Route
          path="/proj/:proj_pk_num/gantt"
          element={<Gantt taskdatas={taskdatas} setTaskdatas={setTaskdatas} />}
        ></Route>
      </Routes>
    </>
  );
};

export default TreeAndGantt;
