import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const FavorCheck = ({pknum, type, favorList}) => {
    const num = useSelector((state)=>state.userData.user_pk_num);
    const [isCheck, setIsCheck] = useState(false);
    const [data, setData] = useState({});

    useEffect(()=>{

        if(type==="post"){
            setData({'favor_fk_user_num':num, 'favor_fk_post_num':pknum});
        } else if (type==="proj"){
            setData({'favor_fk_user_num':num, 'favor_fk_proj_num':pknum});
        }

        if(Array.isArray(favorList)){
            favorList.forEach((data)=>{
                if(data.post_pk_num === pknum){
                    setIsCheck(true);
                }
            })
        } else {
            if(favorList){
                setIsCheck(true);
            } else {
                setIsCheck(false);
            }
        }
        
    },[num, pknum, type, favorList])
    
    const handleClick = () => {
        setIsCheck(prevCheck => {
            const newCheck = !prevCheck;
            if (newCheck) {
              handleAdd();
            } else {
              handleDelete();
            }
            return newCheck;
          });
    }
    
    const handleAdd = () => {
        axios.post(`/favorite/${type}`,data)
        .then(res => {
            if(!res.data){
                navigator(`/error`);
            }
        })
        .catch();
    }

    const handleDelete = () => {
        axios.delete(`/favorite/${type}/${num}/${pknum}`)
        .then(res => {
            if(!res.data){
                navigator(`/error`);
            }
        })
        .catch();
    }

    return (
        <>
            {isCheck? 
            <i className="bi bi-bookmark-fill" style={{color:'#ffae00', cursor: "pointer" }} onClick={handleClick}></i> 
            :<i className="bi bi-bookmark" style={{color:'#ffae00', cursor: "pointer" }} onClick={handleClick}></i> }
        </>
    );
}
export default FavorCheck;
