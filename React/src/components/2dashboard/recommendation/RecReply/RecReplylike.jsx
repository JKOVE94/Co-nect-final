import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const RecReplylike = ({replyPkNum, getData}) => {
  const num = useSelector((state) => state.userData.user_pk_num);
  const compNum = JSON.parse(
    sessionStorage.getItem("persist:userInfo")
  ).user_fk_comp_num;
  
  const [isCheck, setIsCheck] = useState(false);
  // 즐겨찾기 등록

  useEffect(() => {
    handleCheck();
  }, [replyPkNum]);

  const handleCheck = () => {
    axios.get(`/${compNum}/rec/replyLike/${num}/${replyPkNum}`)
    .then(res => setIsCheck(res.data))
    .catch(err => console.log(err));
  }

  const handleAdd = () => {
    axios.post(`/${compNum}/rec/replyLike/${num}/${replyPkNum}`)
    .then(res =>{
        if(res.data){
            setIsCheck(true);
            getData();
        };
    })
    .catch(err => console.log(err));
  } 
  const handleDel = () => {
    axios.delete(`/${compNum}/rec/replyLike/${num}/${replyPkNum}`)
    .then(res =>{
        if(res.data){
            setIsCheck(false);
            getData();
        };
    })
    .catch(err => console.log(err));
  }
  return (
    <>
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
    </>
  );
};
export default RecReplylike;
