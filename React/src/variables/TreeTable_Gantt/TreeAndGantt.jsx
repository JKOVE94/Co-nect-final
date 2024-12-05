import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import TreeTable from "variables/TreeTable_Gantt/TreeTable";
import Ganttchart from "variables/Gantt/Ganttchart"; // Ganttchart를 직접 가져옵니다.
import axios from "axios";
import "rsuite/dist/rsuite-no-reset.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

const TreeAndGantt = () => {
  const [taskdatas, setTaskdatas] = useState([]);
  const [treetaskdatas, setTreetaskdatas] = useState([]);

  console.log(taskdatas);
  console.log(treetaskdatas);
  //일반 구조를 트리구조로
  const convertToTree = (data) => {
    const map = {};
    const roots = [];

    data.forEach((item) => {
      map[item.task_pk_num] = { ...item, children: [] };
    });

    data.forEach((item) => {
      if (item.task_fk_task_num) {
        map[item.task_fk_task_num].children.push(map[item.task_pk_num]);
      } else {
        roots.push(map[item.task_pk_num]);
      }
    });
    return roots;
  };

  //트리구조를 일반 구조로
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/board/task/proj/1");
      const treeData = convertToTree(response.data);
      setTaskdatas(response.data);
      setTreetaskdatas(treeData);
    };

    fetchData();
  }, []); // 빈 배열을 두 번째 인자로 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 설정

  return (
    <>
      <Link to="/main/proj/1/tree">Tree</Link> &nbsp;
      <Link to="/main/proj/1/gantt">Gantt</Link>
      <Routes>
        <Route
          path="/proj/1/tree"
          element={
            <TreeTable
              taskdatas={treetaskdatas}
              setTaskdatas={setTreetaskdatas}
            />
          }
        />
        <Route
          path="/proj/1/gantt"
          element={
            <Ganttchart taskdatas={taskdatas} setTaskdatas={setTaskdatas} />
          }
        />
      </Routes>
    </>
  );
};

export default TreeAndGantt;
