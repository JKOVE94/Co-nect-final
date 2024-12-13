import { useState } from "react";
import { useSelector } from "react-redux";

const { default: MyToDoList } = require("./TempComp/MyToDOList");
const { default: Projtable } = require("./TempComp/ProjTable");

const MainComponent = () => {
  const num = useSelector((state) => state.userData.user_pk_num);
  //toast
  const [toastType, setToastType] = useState("");
  const [toastIsOpen, setToastIsOpen] = useState(false);
  //calendar event(일정)
  const [events, setEvents] = useState([{}]);

  const handleToast = (text, open) => {
    setToastType(text);
    setToastIsOpen(open);
  };

  return (
    <>
      <Projtable />
      <MyToDoList />
    </>
  );
};

export default MainComponent;
