import React, { useEffect, useState, useRef, use } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import TreeTable from "variables/TreeTable_Gantt/TreeTable";
import Ganttchart from "variables/Gantt/Ganttchart"; // Ganttchart를 직접 가져옵니다.
import axios from "axios";
import "rsuite/dist/rsuite-no-reset.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import TreeGanttModal from "variables/Modal/TreeGanttModal";
import { set } from "rsuite/esm/internals/utils/date";
import ToogleSwitch from "./ToogleSwitch";
import Position from "rsuite/esm/internals/Overlay/Position";

const TreeAndGantt = (props) => {
  const navigate = useNavigate();
  const [projectNum, setProjectNum] = useState(props.projPkNum);
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
  const [showM, setShowM] = useState(false); // 모달 상태와 관련된 state
  const handleCloseM = () => setShowM(false); // 모달을 닫는 함수
  const handleShowM = () => setShowM(true); // 모달을 여는 함수
  const [type, setType] = useState(""); // 모달 타입을 결정하는 state
  const [datas, setDatas] = useState({}); // 모달에 전달할 데이터를 저장하는 state

  const [toggle, setToggle] = useState(false); // 토글 스위치 상태를 관리하는 state
  const [taskdatas, setTaskdatas] = useState([]); // 업무 데이터를 저장하는 state
  const [deleteTarget, setDeleteTarget] = useState(0); // 삭제할 대상을 저장하는 state
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

  const handleInsert = async () => {
    handleCloseM();
    const startDate = new Date(editData.task_startdate); // 시작일
    const endDate = new Date(editData.task_deadline); // 마감일
    const task_durationData = Math.ceil(
      (endDate - startDate) / (1000 * 60 * 60 * 24)
    ); // 시작일로부터 마감일까지 일수 계산

    await setEditData({
      ...editData,
      task_depth: editData.task_fk_task_num != null ? 1 : 0, // 부모가 있으면 1, 없으면 0
      task_duration: task_durationData, // 일수 계산 결과
      task_created: new Date().toISOString().split("T")[0], //생성일 추가
    });
    await axios.post("/board/task/insert", editData);
    await fetchData();
  };

  //수정시 실행되는 함수
  const handleUpdate = async () => {
    await axios.put(`/board/task/update/${editData.task_pk_num}`, editData);
  };

  // 삭제 버튼 클릭 시 실행되는 함수
  const handleDelete = async () => {
    handleCloseM();
    await axios.delete(`/board/task/delete/${deleteTarget}`);
    await fetchData();
  };

  //해당 프로젝트의 업무 데이터를 가져오는 함수 (초기 로딩, 업데이트 시 실행)
  const fetchData = async () => {
    const response = await axios.get(`/board/task/proj/${projectNum}`);
    setTaskdatas(response.data);
  };

  // 토글 스위치를 클릭했을 때 실행되는 함수
  useEffect(() => {
    toggle
      ? navigate(`/main/proj/projdetail/${projectNum}/gantt`)
      : navigate(`/main/proj/projdetail/${projectNum}/tree`);
  }, [toggle]);

  // 업데이트 데이터가 변경될 때 실행되는 함수 => 데이터 타입 변경
  useEffect(() => {
    // console.log("updatedData");
    // console.log(updatedData);

    //만약 updateData가 있고 gantt라는 키가 있다면
    if (updatedData && Object.keys(updatedData).includes("gantt")) {
      setEditData({
        ...editData,
        task_title: updatedData.gantt.text,
        task_startdate: updatedData.gantt.start_date,
        task_deadline: updatedData.gantt.end_date,
        task_duration: updatedData.gantt.duration,
        task_progress: updatedData.gantt.progress,
        task_fk_task_num:
          updatedData.gantt.parent > 0 ? updatedData.gantt.parent : null, // 부모가 있으면 부모의 pk, 없으면 null
        task_pk_num: updatedData.gantt.id,
      });
      axios.put(`/board/task/update/${editData.task_pk_num}`, editData);
    } else if (updatedData && Object.keys(updatedData).includes("tree")) {
      setEditData({
        ...editData,
        ...updatedData.tree,
      });
      axios.put(`/board/task/update/${editData.task_pk_num}`, editData);
    }
    fetchData();
  }, [updatedData]);

  useEffect(() => {
    if (deleteTarget != 0) axios.delete(`/board/task/delete/${deleteTarget}`);
    fetchData();
  }, [deleteTarget]);

  useEffect(() => {
    fetchData();
  }, []); // 마운트될 때 한 번만 실행되도록 설정

  return (
    <>
      <Card>
        <CardHeader>
          <h2 style={{ margin: "0" }}>업무 관리</h2>

          <button
            className="btn btn-primary"
            style={{
              fontSize: "0.8em",
              float: "right",
              right: "9em",
              marginBottom: "0.2em",
            }}
            onClick={activeModal}
          >
            새로운 작업 등록
          </button>
          <ToogleSwitch toggle={toggle} setToggle={setToggle} />
        </CardHeader>
        <CardBody>
          <Routes>
            <Route
              path={`/`}
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
