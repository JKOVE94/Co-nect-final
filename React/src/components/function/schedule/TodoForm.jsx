import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import moment from "moment";

const TodoForm = ({onClose}) => {

    const [num, setNum] = useState(10); //현재 로그인한 사용자의 넘버

    const [data, setData] = useState({todo_fk_user_num:num})
    const navigate = useNavigate();
    const handleChange = (e) => {
        setData({...data, [e.target.id]:e.target.value})  
    }

    const handleClick = ()=>{
        console.log(data);
        axios.post('/function/schedule',data)
        .then(res => {
            if(res.data){
                navigate(0); //새로고침
            }
        })  
        .catch(err => console.log(err));
    }


    return (
        <div>
            제목 : <input type="text" id="todo_title" onChange={handleChange}/><br/>
            내용 : <textarea id="todo_content" onChange={handleChange}></textarea><br/>
            시작일 : <input type="datetime-local"  id="todo_start" onChange={handleChange}/><br/>
            종료일 : <input type="datetime-local" id="todo_end" onChange={handleChange}/><br/>
            
            <button onClick={handleClick}>등록</button>
            <button onClick={onClose}>닫기</button>
        </div>
    );
    
}
export default TodoForm;