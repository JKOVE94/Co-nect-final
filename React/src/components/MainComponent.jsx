import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import MyToDoList from "./TempComp/MyToDOList";

import Tasktable from "./TempComp/Tasktable";
import { PROJSEL } from "../Redux/Reducer/projDataReducer";

const MainComponent = (props) => {
  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const user_pk_num = userInfo.user_pk_num; //사번
  const compPkNum = userInfo.user_fk_comp_num; //회사번호
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectNum = searchParams.get("");

  return (
    <>
      <Tasktable projPkNum={props.projPkNum} />
      <MyToDoList user_pk_num={user_pk_num} projPkNum={props.projPkNum} />
    </>
  );
};

export default MainComponent;
