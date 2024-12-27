import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import MyToDoList from "./TempComp/MyToDOList";

import Tasktable from "./TempComp/Tasktable";
import { PROJSEL } from "../Redux/Reducer/projDataReducer";

const MainComponent = (props) => {
  const user_pk_num = useSelector((state) => state.userData.user_pk_num);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectNum = searchParams.get("proj");

  const dispatch = useDispatch();

  useEffect(() => {
    if (projectNum) {
      dispatch(PROJSEL({ proj_pk_num: projectNum }));
    }
  }, [dispatch, projectNum]);

  return (
    <>
      <Tasktable projectNum={projectNum} projPkNum={props.projPkNum} />
      <MyToDoList user_pk_num={user_pk_num} projPkNum={props.projPkNum} />
    </>
  );
};

export default MainComponent;
