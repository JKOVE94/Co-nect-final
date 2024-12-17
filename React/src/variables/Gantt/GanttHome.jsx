import React, { useState, useEffect } from "react";
import axios from "axios";
import Ganttchart from "./Ganttchart";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import "./GanttHome.css";

const GanttHome = (props) => {
  const [status, setStatus] = useState(1); //normal(1), finished(2), alert(3) 3가지 상태
  const [projectNum, setProjectNum] = useState(props.projPkNum);
  const [taskdatas, setTaskdatas] = useState([]); // 업무 데이터를 저장하는 state
  const [projdatas, setProjdatas] = useState([]); // 프로젝트 데이터를 저장하는 state
  const [searchType, setSearchType] = useState("taskName");
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setSearchValue(e.target.value);
      //   alert("검색");
    }
  };
  //검색창에 포커스를 주는 함수
  const focusOnInput = () => {
    document.querySelector(".search").focus();
  };

  //해당 프로젝트의 업무 데이터를 가져오는 함수 (초기 로딩, 업데이트 시 실행)
  const fetchTaskData = async () => {
    const taskResponse = await axios.get(`/board/task/proj/${projectNum}`);
    // console.log(taskResponse.data);
    setTaskdatas(taskResponse.data);
  };

  //해당 프로젝트의 정보 데이터를 가져오는 함수 (초기 로딩, 업데이트 시 실행)
  const fetcProjData = async () => {
    const projResponse = await axios.get(`/proj/projread/${projectNum}`);
    setProjdatas(projResponse.data);
  };

  const checkStatus = () => {
    if (projdatas.proj_progress === 100) {
      setStatus(2);
    } else {
      const projEndDate = new Date(projdatas.proj_enddate);
      const currentDate = new Date();
      if (projEndDate < currentDate) {
        setStatus(3);
      }
    }
  };

  //검색 카테고리가 바뀌면 state에 저장
  const handleTypeChange = () => {
    return (e) => {
      setSearchType(e.target.value);
      // console.log(searchType);
    };
  };

  useEffect(() => {
    fetcProjData();
    fetchTaskData();
  }, []); // 마운트될 때 한 번만 실행되도록 설정

  const fetchSearchData = async () => {
    const response = await axios.post(`/board/task/search`, {
      projectNum: projectNum,
      searchType: searchType,
      searchValue: searchValue,
    });
    setTaskdatas(response.data);
    // console.log(response.data);
  };

  useEffect(() => {
    fetchSearchData();
  }, [searchValue]);

  useEffect(() => {
    checkStatus();
  }, [projdatas]);
  return (
    <>
      <Card>
        <CardBody style={{ backgroundColor: "#E5E7EB0F" }}>
          <span>
            <select className="selectboxSearch" onChange={handleTypeChange()}>
              <option value="taskName">업무</option>
              <option value="taskUser">담당자</option>
            </select>
          </span>
          <span id="searchBox" onClick={() => focusOnInput()}>
            <i className="bi bi-search glass"></i>
            <input
              type="text"
              onKeyDown={(e) => handleSearch(e)}
              className="search"
              placeholder="검색..."
              style={{ width: "100%" }}
            />
          </span>
          <div id="info-container">
            <span id="title">
              {projdatas.proj_pk_num}&nbsp;{projdatas.proj_name}
            </span>

            <span>
              <i className="bi bi-person-fill"></i> 담당자 :
              {projdatas.proj_username}
            </span>
            <span>
              <i className="bi bi-calendar-fill"></i> 마감기한 :
              {projdatas.proj_enddate}
            </span>
            <span
              className={
                status === 3 ? "alert" : status === 2 ? "finished" : ""
              }
            >
              {status === 3 ? (
                <i className="bi bi-exclamation-circle-fill"></i>
              ) : (
                <i className="bi bi-check-circle-fill"></i>
              )}
              &nbsp; 진행상황 : {projdatas.proj_progress} %
            </span>
          </div>
          <Ganttchart taskdatas={taskdatas} />
        </CardBody>
      </Card>
    </>
  );
};

export default GanttHome;
