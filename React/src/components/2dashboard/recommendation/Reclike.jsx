import axiosInstance from "api/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Reclike = ({ recPkNum, likes, handleError }) => {
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호사번호

  //로그인한 사용자가 좋아요한 게시글인지 확인인
  const [isCheck, setIsCheck] = useState(false);
  const [num, setNum] = useState(likes);

  useEffect(() => {
    handleCheck();
    setNum(likes);
  }, [likes]);

  //좋아요한 게시글이라면 setIsCheck(true)
  const handleCheck = () => {
    axiosInstance
      .get(`/conect/${compNum}/rec/like/${userNum}/${recPkNum}`)
      .then((res) => setIsCheck(res.data))
      .catch((err) => handleError(err.response.data, true));
  };

  //좋아요 등록
  const handleAdd = () => {
    axiosInstance
      .post(`/conect/${compNum}/rec/like/${userNum}/${recPkNum}`)
      .then((res) => {
        if (res.data) {
          setIsCheck(true);
          setNum((pre) => pre + 1);
        }
      })
      .catch((err) =>
        handleError(
          "좋아요를 누르지 못했습니다. 잠시 후 다시 시도해주세요.",
          true
        )
      );
  };

  //좋아요 삭제
  const handleDel = () => {
    axiosInstance
      .delete(`/conect/${compNum}/rec/like/${userNum}/${recPkNum}`)
      .then((res) => {
        if (res.data) {
          setIsCheck(false);
          setNum((pre) => pre - 1);
        }
      })
      .catch((err) =>
        handleError(
          "좋아요를 취소하는 중 문제가 발생했습니다. 다시 시도해주세요.",
          true
        )
      );
  };
  return (
    <>
      {isCheck ? (
        <>
          <i
            className="bi bi-heart-fill"
            style={{ color: "#ff007f", cursor: "pointer" }}
            onClick={handleDel}
          ></i>{" "}
          &nbsp;좋아요 {num}회
        </>
      ) : (
        <>
          <i
            className="bi bi-heart"
            style={{ color: "#ff007f", cursor: "pointer" }}
            onClick={handleAdd}
          ></i>{" "}
          &nbsp;좋아요 {num}회
        </>
      )}
    </>
  );
};
export default Reclike;
