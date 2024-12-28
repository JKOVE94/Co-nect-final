import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const FavorCheck = ({ pknum, type, favorData }) => {
  const info = JSON.parse(sessionStorage.getItem("persist:root"));
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const num = userInfo.user_pk_num; //사번
  const compPkNum = userInfo.user_fk_comp_num; //회사번호
  const [isCheck, setIsCheck] = useState(false);
  // 즐겨찾기 등록
  const [data, setData] = useState({});
  // 서버에 보낼 데이터(usernum, post pk num, proj pk num)

  useEffect(() => {
    if (type === "post") {
      setData({ favor_fk_user_num: num, favor_fk_post_num: pknum });
    } else if (type === "proj") {
      setData({ favor_fk_user_num: num, favor_fk_proj_num: pknum });
    }

    if (Array.isArray(favorData)) {
      //List가 넘어올 경우(post list, proj list)
      favorData.forEach((data) => {
        if (type === "post" && data.post_pk_num === pknum) {
          setIsCheck(true);
          //즐겨찾기에 등록되어있다면 true
        } else if (type === "proj" && data.proj_pk_num === pknum) {
          setIsCheck(true);
        }
      });
    } else {
      axios
        .get(`/favorite/${type}/${num}/${pknum}`)
        .then((res) => setIsCheck(res.data))
        .catch((err) => setIsCheck(false));
    }
  }, [num, pknum, type, favorData]);

  const handleClick = () => {
    setIsCheck((prevCheck) => {
      //즐겨찾기 클릭 후 isCheck true -> 즐겨찾기 추가, false -> 즐겨찾기 삭제
      const newCheck = !prevCheck;
      if (newCheck) {
        handleAdd();
      } else {
        handleDelete();
      }
      return newCheck;
    });
  };

  const handleAdd = () => {
    axios
      .post(`/favorite/${type}`, data)
      .then((res) => {
        if (!res.data) {
          navigator(`/error`);
        }
      })
      .catch();
  };

  const handleDelete = () => {
    axios
      .delete(`/favorite/${type}/${num}/${pknum}`)
      .then((res) => {
        if (!res.data) {
          navigator(`/error`);
        }
      })
      .catch();
  };

  return (
    <>
      {isCheck ? (
        <i
          className="bi bi-bookmark-fill"
          style={{ color: "#ffae00", cursor: "pointer" }}
          onClick={handleClick}
        ></i>
      ) : (
        <i
          className="bi bi-bookmark"
          style={{ color: "#ffae00", cursor: "pointer" }}
          onClick={handleClick}
        ></i>
      )}
    </>
  );
};
export default FavorCheck;
