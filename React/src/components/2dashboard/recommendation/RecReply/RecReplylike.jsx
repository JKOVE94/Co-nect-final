import axiosInstance from "api/axiosInstance";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RecReplylike = ({replyPkNum, getData}) => {
  const userNum = useSelector((state) => state.userData.user_pk_num); //사번번
  const compNum = useSelector((state) => state.userData.user_fk_comp_num); //회사번호
  
  const [isCheck, setIsCheck] = useState(false);
  // 즐겨찾기 등록

  useEffect(() => {
    handleCheck();
  }, [replyPkNum]);

  const handleCheck = () => {
    axiosInstance.get(`/${compNum}/rec/replyLike/${userNum}/${replyPkNum}`)
    .then(res => setIsCheck(res.data))
    .catch(err => console.log(err));
  }

  const handleAdd = () => {
    axiosInstance.post(`/${compNum}/rec/replyLike/${userNum}/${replyPkNum}`)
    .then(res =>{
        if(res.data){
            setIsCheck(true);
            getData();
        };
    })
    .catch(err => console.log(err));
  } 
  const handleDel = () => {
    axiosInstance.delete(`/${compNum}/rec/replyLike/${userNum}/${replyPkNum}`)
    .then(res =>{
        if(res.data){
            setIsCheck(false);
            getData();
        };
    })
    .catch(err => console.log(err));
  }
  return (
    <span style={{marginLeft:'1rem'}}>
      {isCheck ? (
        <i
          className="bi bi-heart-fill"
          style={{ color: "#ff007f", cursor: "pointer"}}
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
