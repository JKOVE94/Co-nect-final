import React from "react";
import { Routes, Route } from "react-router-dom";
import TaskList from "./TaskList";
import TaskDetail from "./TaskDetail";
import TaskCreate from "./TaskCreate";
import TaskEdit from "./TaskEdit";

const TaskHome = (props) => {
  return (
    <Routes>
      <Route
        path="/:projectNum"
        element={<TaskList projPkNum={props.projPkNum} />}
      />
      <Route
        path="/detail/:taskPkNum"
        element={<TaskDetail projPkNum={props.projPkNum} />}
      />
      <Route
        path="/create/:projectNum"
        element={<TaskCreate projPkNum={props.projPkNum} />}
      />
      <Route path="/edit/:projectNum/:taskId" element={<TaskEdit />} />
    </Routes>
  );
};

export default TaskHome;
