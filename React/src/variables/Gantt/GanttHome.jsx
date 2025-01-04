import React, { useState, useEffect } from "react";
import axios from "axios";
import Ganttchart from "./Ganttchart";
import { Card, CardBody, CardHeader } from "react-bootstrap";
import "./GanttHome.css";
import axiosInstance from "api/axiosInstance";

const GanttHome = (props) => {
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const compNum = userInfo.user_fk_comp_num; //회사번호

  const [status, setStatus] = useState(1); //normal(1), finished(2), alert(3) 3가지 상태
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
    const taskResponse = await axiosInstance.get(
      `/conect/${compNum}/task/task/proj/${props.projPkNum}`
    );
    // console.log(taskResponse.data);
    setTaskdatas(taskResponse.data);
  };

  //해당 프로젝트의 정보 데이터를 가져오는 함수 (초기 로딩, 업데이트 시 실행)
  const fetchProjData = async () => {
    const projResponse = await axiosInstance.get(
      `/conect/${compNum}/proj/projdetail/${props.projPkNum}`
    );
    // console.log("-----------------");
    setProjdatas(projResponse.data);
    // console.log(projResponse.data);
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
    fetchProjData();
    fetchTaskData();
  }, [props.projPkNum]); // 마운트될 때 한 번만 실행되도록 설정

  const fetchSearchData = async () => {
    const response = await axiosInstance.post(
      `/conect/${compNum}/task/search`,
      {
        projectNum: props.projPkNum,
        searchType: searchType,
        searchValue: searchValue,
      }
    );
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
              {projdatas.proj_pk_num}&nbsp;{projdatas.proj_title}
            </span>

            <span>
              <i className="bi bi-person-fill"></i> 담당자 :
              {projdatas.proj_manager}
            </span>
            <span>
              <i className="bi bi-calendar-fill"></i> 마감기한 :
              {projdatas.proj_enddate}
            </span>
          </div>
          <Ganttchart taskdatas={taskdatas} />
        </CardBody>
      </Card>
    </>
  );
};

export default GanttHome;
