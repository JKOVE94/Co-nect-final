import { Routes, Route } from "react-router-dom";
import UserInfo from "./UserInfo";
import UserAdd from "./UserAdd";
import UserEdit from "./UserEdit";
import UserUnlock from "./UserUnlock";

const UserHome = () => {
  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userPkNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호

  return (
    <>
      {userInfo.user_author != 3 ? (
        <h2>해당 기능에 대한 권한이 없습니다.</h2>
      ) : (
        <Routes>
          <Route path="/info" element={<UserInfo compNum={compNum} />} />
          <Route path="/add" element={<UserAdd compNum={compNum} />} />
          <Route
            path="/edit/:userPkNum"
            element={<UserEdit compNum={compNum} />}
          />
          <Route path="/unlock" element={<UserUnlock compNum={compNum} />} />
        </Routes>
      )}
    </>
  );
};

export default UserHome;
