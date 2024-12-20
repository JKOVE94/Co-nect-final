import { Button, Dropdown } from "react-bootstrap";
import RecReplylike from "./RecReplylike";
import moment from "moment";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import RecReplyCreate from "./RecReplyCreate";

const RecReply = ({data, getData, recPkNum}) => {
    const compNum = JSON.parse(
        //회사번호
        sessionStorage.getItem("persist:userInfo")
      ).user_fk_comp_num;
    const num = useSelector((state)=>state.userData.user_pk_num);
    const [reply, setReply] = useState({});
    const [text, setText] = useState(data.reply_content);
    const [hide, setHide] = useState(true);

    useEffect(()=>{
        setText(data.reply_content);
        setReply({...data, disable:true});
    },[data])
    
    const handleDelete = (replyPkNum) => {
        axios.delete(`/${compNum}/rec/reply/${replyPkNum}`)
        .then(res => {
            if(res.data){
                getData();
            }
        }).catch(err=>console.log(err))
    }    
    const handleUpdate = (type) => {
        if(type==="up")
            setReply({...reply, disable:false});
        else if(type==="upEnd")
            setReply({...reply, disable:true});
    }

    const handleClick = () => {
        axios.put(`/${compNum}/rec/reply`,reply)
        .then(res => {
            setReply({...res.data, disable:true});

        })
        .catch(err => console.log(err));
    }

    return (
        <>
            <div style={{marginLeft:reply.reply_depth*30}}>
                {reply.reply_depth !== 0 ?  "└ " : ""}
                익명{reply.reply_pk_num+1}<br/>
                <input type="text" id="reply_content" value={text} disabled={reply.disable}
                    onChange={(e)=>{
                        setText(e.target.value);
                        setReply({...reply, [e.target.id]:e.target.value})
                    }} />
                <RecReplylike replyPkNum={data.reply_pk_num} getData={getData} /> {data.reply_likes}
                <Button hidden={reply.disable} onClick={handleClick}>수정확인</Button>
                {reply.reply_fk_user_num === num ?
                 
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
                        {reply.disable ? 
                        <Dropdown.Item as="button" onClick={()=>{handleUpdate("up")}}>수정</Dropdown.Item> :
                        <Dropdown.Item as="button" onClick={()=>{handleUpdate("upEnd")}}>수정취소</Dropdown.Item> }
                        
                        <Dropdown.Item as="button" onClick={()=>{handleDelete(reply.reply_pk_num)}}>삭제</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                 
                 :<></>
                }
                <br/>
                <small>{moment(reply.reply_regdate).format("YYYY-MM-DD HH:mm")}
                    {reply.reply_fk_user_num !== num && reply.reply_depth === 0? <Button variant="light" onClick={()=>setHide(!hide)}>답글달기</Button> :<></>}
                </small>
            </div>
            <RecReplyCreate onHide={hide} recPkNum={recPkNum} replyParent={reply.reply_parent} getData={getData} />
        </>
    );
}
export default RecReply;