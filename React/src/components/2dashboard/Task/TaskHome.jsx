import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import TaskList from "./TaskList";
import TaskCreate from "./TaskCreate";
import TaskEdit from "./TaskEdit";
import TaskDetail from "./TaskDetail"; // TaskEdit 컴포넌트 import

const TaskHome = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Routes>
                <Route path="/tasklist/:projectNum" element={<TaskList />} />
                <Route path="/taskcreate/:projectNum" element={<TaskCreate />} />
                <Route path="/task/detail/:taskPkNum" element={<TaskDetail />} />
                <Route path="/taskedit/:taskId" element={<TaskEdit />} />
            </Routes>
        </div>
    );
};

export default TaskHome;