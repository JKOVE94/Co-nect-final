import React from "react";
import { Chart } from "react-google-charts";

const Gantt2 = ({ taskdatas }) => {
  // taskdatas를 트리 구조로 변환하는 함수
  const convertToTreeData = (tasks) => {
    const map = {};
    const roots = [];

    tasks.forEach((task) => {
      map[task.task_pk_num] = { ...task, children: [] };
    });

    tasks.forEach((task) => {
      if (task.task_depth > 1 && task.task_fk_task_num) {
        map[task.task_fk_task_num].children.push(map[task.task_pk_num]);
      } else {
        roots.push(map[task.task_pk_num]);
      }
    });

    return roots;
  };

  const treeData = convertToTreeData(taskdatas);

  // 트리 데이터를 간트 차트 데이터로 변환하는 함수
  const convertToGanttData = (treeData) => {
    const columns = [
      { type: "string", label: "Task ID" },
      { type: "string", label: "Task Name" },
      { type: "string", label: "Resource" },
      { type: "date", label: "Start Date" },
      { type: "date", label: "End Date" },
      { type: "number", label: "Duration" },
      { type: "number", label: "Percent Complete" },
      { type: "string", label: "Dependencies" },
    ];

    const rows = [];

    const traverse = (node, parentId = null) => {
      const {
        task_pk_num,
        task_title,
        task_startdate,
        task_deadline,
        task_percent_complete,
      } = node;

      rows.push([
        task_pk_num,
        task_title,
        null,
        new Date(task_startdate),
        new Date(task_deadline),
        null,
        task_percent_complete,
        parentId,
      ]);

      node.children.forEach((child) => traverse(child, task_pk_num));
    };

    treeData.forEach((node) => traverse(node));

    return [columns, ...rows];
  };

  const ganttData = convertToGanttData(treeData);

  const options = {
    height: 400,
    gantt: {
      trackHeight: 30,
    },
  };

  return (
    <Chart
      chartType="Gantt"
      width="100%"
      height="50%"
      data={ganttData}
      options={options}
    />
  );
};

export default Gantt2;
