import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const { default: MyToDoList } = require("./TempComp/MyToDOList");
const { default: Projtable } = require("./TempComp/ProjTable");

const MainComponent = () => {
  const num = useSelector((state) => state.userData.user_pk_num);
  //toast
  const [toastType, setToastType] = useState("");
  const [toastIsOpen, setToastIsOpen] = useState(false);
  //calendar event(일정)
  const [events, setEvents] = useState([{}]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectNum = searchParams.get("proj");
  const userNum = searchParams.get("user");

  const handleToast = (text, open) => {
    setToastType(text);
    setToastIsOpen(open);
  };

  return (
    <>
      <Projtable projectNum={projectNum} />

      <MyToDoList />
    </>
  );
};

export default MainComponent;
