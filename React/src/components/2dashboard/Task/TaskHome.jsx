import React from "react";
import { Routes, Route } from "react-router-dom";
import TaskList from "./TaskList";
import TaskDetail from "./TaskDetail";
import TaskCreate from "./TaskCreate";

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
        path="/create"
        element={<TaskCreate projPkNum={props.projPkNum} />}
      />
    </Routes>
  );
};

export default TaskHome;
