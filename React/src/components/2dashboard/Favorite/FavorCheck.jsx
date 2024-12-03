import axios from "axios";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
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

        favorList.forEach((data)=>{
            if(data.post_pk_num === pknum){
                setIsCheck(true);
            }
        })
    },[num, pknum, type, favorList])
    
    const handleChange = (e) => {
        setIsCheck(e.target.checked);
        if(e.target.checked){
            handleAdd();
        } else {
            handleDelete();
        }
    }
    const handleAdd = () => {
        axios.post(`/board/favorite/${type}`,data)
        .then(res => {
            if(!res.data.isSuccess){
                //에러처리
            }
        })
        .catch();
    }
    const handleDelete = () => {
        axios.delete(`/board/favorite/${type}/${num}/${pknum}`)
        .then(res => {
            if(!res.data.isSuccess){
                //에러처리
            }
        })
        .catch();
    }
    return (
        <>
            <Form.Check
                id={pknum}
                checked={isCheck}
                onChange={handleChange}
            >
            </Form.Check>
        </>
    );
}
export default FavorCheck;