import axios from "axios";
import { useEffect, useState } from "react";
import { Badge, Card, CardBody, CardTitle, Col, Dropdown, DropdownButton } from "react-bootstrap";
import { useSelector } from "react-redux";
import RecReplylike from "./RecReplylike";
import RecReplyCreate from "./RecReplyCreate";
import moment from "moment";
import '../../../../assets/css/2dashboard/rec.css'
const RecReplyList = ({recPkNum}) => {
    const compNum = JSON.parse(
        //회사번호
        sessionStorage.getItem("persist:userInfo")
      ).user_fk_comp_num;
    const [datas, setDatas] = useState([]);
    const [disable, setDisable] = useState(true);

    const getData = () => {
        axios.get(`/${compNum}/rec/reply/${recPkNum}`)
        .then(res => {
            setDatas(res.data);
        })
        .catch(err => console.log(err));
    }
    const num = useSelector((state)=>state.userData.user_pk_num);
    const handleDelete = (replyPkNum) => {
        axios.delete(`/${compNum}/rec/reply/${replyPkNum}`)
        .then(res => {
            if(res.data){
                getData();
            }
        }).catch(err=>console.log(err))
    }    

    useEffect(()=>{
        getData();
    },[])
    
    return(
        <Card>
            <CardTitle>
                댓글
            </CardTitle>
            <CardBody>
            {datas ? datas.map((data,index) => (
                <div style={{marginLeft:data.reply_depth*30}}>
                {data.reply_depth !== 0 ?  "└ " : ""}
                익명{data.reply_pk_num+1}<br/>
                <input type="text" id="reply_content" value={data.reply_content} disabled={disable} />
                <RecReplylike replyPkNum={data.reply_pk_num} recPkNum={recPkNum} getData={getData} /> {data.reply_likes}
                {data.reply_fk_user_num === num ?
                 
                 
                 <Dropdown>
                    <Dropdown.Toggle
                        id="dropdown-item-button"
                        variant="light"
                        className="d-flex align-items-center p-0"
                        style={{ background: "none", border: "none", boxShadow: "none" }}
                    >
                        <h4>&#8942;</h4>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item as="button" >수정</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={()=>{handleDelete(data.reply_pk_num)}}>삭제</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                 
                 :<></>
                }
                <br/>
                <small>{moment(data.reply_regdate).format("YYYY-MM-DD")}</small>
            </div>
            )) : <></>}
            </CardBody>
            <RecReplyCreate recPkNum={recPkNum} getData={getData}></RecReplyCreate>
        </Card>
    );
}
export default RecReplyList;