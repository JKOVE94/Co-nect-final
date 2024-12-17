import { Routes, Route } from "react-router-dom";
import UserInfo from "./UserInfo";
import UserAdd from "./UserAdd";
import UserEdit from "./UserEdit";
import UserUnlock from "./UserUnlock";

const UserHome = () => {
  return (
    <Routes>
      <Route path="/info" element={<UserInfo />} />
      <Route path="/add" element={<UserAdd />} />
      <Route path="/edit" element={<UserEdit />} />
      <Route path="/unlock" element={<UserUnlock />} />
    </Routes>
  );
};

export default UserHome;
