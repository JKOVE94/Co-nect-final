import React, { useState } from "react";
import ManageUserToast from "variables/Toast/ManageUserToast";

const Test = () => {
  const [showA, setShowA] = useState(false);
  const [type, setType] = useState("unlocked");
  const toggleShowA = () => {
    setShowA(true);
    setTimeout(() => {
      setShowA(false);
    }, 3000);
  };
  return (
    <>
      <ManageUserToast type={type} showA={showA} toggleShowA={toggleShowA} />
    </>
  );
};

export default Test;
