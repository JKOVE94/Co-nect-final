import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import MyToDoList from "./TempComp/MyToDOList";

import Tasktable from "./TempComp/Tasktable";

const MainComponent = () => {
  const user_pk_num = useSelector((state) => state.userData.user_pk_num);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectNum = searchParams.get("proj");

  console.log(projectNum);

  return (
    <>
      <Tasktable projectNum={projectNum} />
      <MyToDoList user_pk_num={user_pk_num} />
    </>
  );
};

export default MainComponent;
