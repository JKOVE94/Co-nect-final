import RecReplyCreate from "./RecReplyCreate";
import RecReply from "./RecReply";
import axiosInstance from "api/axiosInstance";
import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import '../../../../assets/css/2dashboard/rec.css'
import style from "../../../../assets/css/2dashboard/rec.module.css";

import Error from "../Error";

const RecReplyList = ({recPkNum}) => {

    const compNum = useSelector((state) => state.userData.user_fk_comp_num); //회사번호
    const [datas, setDatas] = useState([]); //데이터

    //에러
    const [error, setError] = useState();
    const [errorIsOpen, setErrorIsOpen] = useState(false);
    
    const handleError = (error, errorIsOpen)=>{
        setError(error);
        setErrorIsOpen(errorIsOpen);
    }
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const res = await axiosInstance.get(`/${compNum}/rec/reply/${recPkNum}`);
            const data = res.data
                .map((data) => ({ ...data, disable: true }))
            setDatas(data);
        } catch (err) {
            console.log(err);
        }
    };
    
    return(
        <>
        <Card style={{border:'none', padding:'1rem'}}>
            <CardTitle>
                댓글
            </CardTitle>
            <CardBody>
            {datas ? datas.map((data,index) => (
                <RecReply key={index} data={data} recPkNum={recPkNum} getData={getData} handleError={handleError}/>
            )) : <></>}
            </CardBody>
        </Card>
        <div className={style.createContainer}>
            <RecReplyCreate recPkNum={recPkNum} getData={getData} handleError={handleError} />
        </div>
        <Error error={error} isOpen={errorIsOpen} onClose={()=>{
          setErrorIsOpen(false);
        }}/>
        </>
    );
}
export default RecReplyList;