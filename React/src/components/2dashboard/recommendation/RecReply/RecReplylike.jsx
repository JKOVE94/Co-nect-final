import axiosInstance from "api/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RecReplylike = ({ replyPkNum, getData, handleError }) => {
  const userInfoFromRoot = JSON.parse(
    sessionStorage.getItem("persist:root")
  ).userData;
  const userInfo = JSON.parse(userInfoFromRoot);
  const userNum = userInfo.user_pk_num; //사번
  const compNum = userInfo.user_fk_comp_num; //회사번호

  const [isCheck, setIsCheck] = useState(false);
  // 즐겨찾기 등록

  useEffect(() => {
    handleCheck();
  }, [replyPkNum]);

  const handleCheck = () => {
    axiosInstance
      .get(`/conect/${compNum}/rec/replyLike/${userNum}/${replyPkNum}`)
      .then((res) => setIsCheck(res.data))
      .catch((err) => handleError(err.response.data, true));
  };

  const handleAdd = () => {
    axiosInstance
      .post(`/conect/${compNum}/rec/replyLike/${userNum}/${replyPkNum}`)
      .then((res) => {
        if (res.data) {
          setIsCheck(true);
          getData();
        }
      })
      .catch((err) =>
        handleError(
          "좋아요를 누르지 못했습니다. 잠시 후 다시 시도해주세요.",
          true
        )
      );
  };
  const handleDel = () => {
    axiosInstance
      .delete(`/conect/${compNum}/rec/replyLike/${userNum}/${replyPkNum}`)
      .then((res) => {
        if (res.data) {
          setIsCheck(false);
          getData();
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
    <span style={{ marginLeft: "1rem" }}>
      {isCheck ? (
        <i
          className="bi bi-heart-fill"
          style={{ color: "#ff007f", cursor: "pointer" }}
          onClick={handleDel}
        ></i>
      ) : (
        <i
          className="bi bi-heart"
          style={{ color: "#ff007f", cursor: "pointer" }}
          onClick={handleAdd}
        ></i>
      )}
    </span>
  );
};
export default RecReplylike;
