import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const FavorCheck = ({ pknum, type, favorData }) => {
  const num = useSelector((state) => state.userData.user_pk_num);
  const [isCheck, setIsCheck] = useState(false);
  // 즐겨찾기 등록
  const [data, setData] = useState({});
  // 서버에 보낼 데이터(usernum, post pk num, proj pk num)

  const location = useLocation();
  

  useEffect(() => {
    if(location.state != null) {
      favorData = location.state;
    }

    if (type === "post") {
      setData({ favor_fk_user_num: num, favor_fk_post_num: pknum });
    } else if (type === "proj") {
      setData({ favor_fk_user_num: num, favor_fk_proj_num: pknum });
    }

    if (Array.isArray(favorData)) {
      //List가 넘어올 경우(post list, proj list)
      favorData.forEach((data) => {
        if (data.post_pk_num === pknum) {
          setIsCheck(true);
          //즐겨찾기에 등록되어있다면 true
        }
      });
    } else {
      if (favorData) {
        //boolean이 넘어올 경우(post detail, proj detail)
        setIsCheck(true);
        //즐겨찾기에 등록되어있다면 true
      } else {
        setIsCheck(false);
      }
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
