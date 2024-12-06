import React, { useEffect, useState, useRef } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";
import TreeTable from "variables/TreeTable_Gantt/TreeTable";
import Ganttchart from "variables/Gantt/Ganttchart"; // Ganttchart를 직접 가져옵니다.
import axios from "axios";
import "rsuite/dist/rsuite-no-reset.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import TreeGanttModal from "variables/Modal/TreeGanttModal";
import { set } from "rsuite/esm/internals/utils/date";

const TreeAndGantt = () => {
  const [projectNum, setProjectNum] = useState(1);
  const [editData, setEditData] = useState({
    task_title: "",
    task_desc: "",
    task_startdate: "",
    task_deadline: "",
    task_enddate: "",
    task_progress: 0,
    task_status: "미시작",
    task_priority: 0,
    task_tag: "0",
    task_tagcol: "red",
    task_fk_user_num: null,
    task_fk_proj_num: projectNum,
    task_fk_task_num: null,
    task_pk_num: null, // autoincrement
    task_duration: 0,
    task_updated: new Date().toISOString().split("T")[0],
    task_depth: 0,
  });
  const [taskdatas, setTaskdatas] = useState([]);
  const [toggle, setToggle] = useState(false);
  const [showM, setShowM] = useState(false); // 모달 상태와 관련된 state
  const handleCloseM = () => setShowM(false); // 모달을 닫는 함수
  const handleShowM = () => setShowM(true); // 모달을 여는 함수
  const [type, setType] = useState(""); // 모달 타입을 결정하는 state
  const [datas, setDatas] = useState({}); // 모달에 전달할 데이터를 저장하는 state
  const [deleteTarget, setDeleteTarget] = useState(null); // 삭제할 대상을 저장하는 state
  const [updatedData, setUpdatedData] = useState({}); // 업데이트할 데이터를 저장하는 state
  const inputRefs = useRef({});

  const activeModal = () => {
    setType("taskAdd");
    handleShowM();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
    inputRefs.current[name] = e.target; // input 요소의 ref를 저장
  };

  useEffect(() => {
    console.log(editData);
  }, [editData]);

  const handleInsert = async () => {
    handleCloseM();
    const startDate = new Date(editData.task_startdate);
    const endDate = new Date(editData.task_deadline);
    const task_durationData = Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    ); // 일수 계산

    await setEditData({
      ...editData,
      task_depth: editData.task_fk_task_num != null ? 1 : 0,
      task_duration: task_durationData,
      task_created: new Date().toISOString().split("T")[0],
    });
    await axios.post("/board/task/insert", editData);
    await fetchData();
  };

  const handleUpdate = async () => {
    await axios.put(`/board/task/update/${editData.task_pk_num}`, editData);
  };

  const handleDelete = async () => {
    handleCloseM();
    await axios.delete(`/board/task/delete/${deleteTarget}`);
    await fetchData();
  };

  const fetchData = async () => {
    const response = await axios.get(`/board/task/proj/${projectNum}`);
    setTaskdatas(response.data);
  };

  useEffect(() => {
    console.log("updatedData" + updatedData);
  }, [updatedData]);

  useEffect(() => {
    console.log("deleteTarget" + deleteTarget);
  }, [deleteTarget]);

  useEffect(() => {
    fetchData();
  }, []); // 빈 배열을 두 번째 인자로 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 설정

  return (
    <>
      <Link to="/main/proj/tree">Tree</Link> &nbsp;
      <Link to="/main/proj/gantt">Gantt</Link>
      <Card>
        <CardHeader>
          <h2 style={{ margin: "0" }}>업무 관리 테이블</h2>
          <button
            className="btn btn-primary"
            style={{ fontSize: "0.8em" }}
            onClick={activeModal}
          >
            새로운 작업 등록
          </button>
        </CardHeader>
        <CardBody>
          <Routes>
            <Route
              path="/proj/tree"
              element={
                <TreeTable
                  taskdatas={taskdatas}
                  setTaskdatas={setTaskdatas}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  handleShowM={handleShowM}
                  setType={setType}
                  setDeleteTarget={setDeleteTarget}
                  setUpdatedData={setUpdatedData}
                />
              }
            />
            <Route
              path="/proj/gantt"
              element={
                <Ganttchart
                  taskdatas={taskdatas}
                  setTaskdatas={setTaskdatas}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  handleShowM={handleShowM}
                  setType={setType}
                  setDeleteTarget={setDeleteTarget}
                  setUpdatedData={setUpdatedData}
                />
              }
            />
          </Routes>
        </CardBody>
      </Card>
      <TreeGanttModal
        projectNum={projectNum}
        handleCloseM={handleCloseM}
        handleShowM={handleShowM}
        showM={showM}
        type={type}
        datas={datas}
        handleInsert={handleInsert}
        handleChange={handleChange}
        editData={editData}
        inputRefs={inputRefs}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default TreeAndGantt;
