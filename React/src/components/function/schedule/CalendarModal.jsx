import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Modal from 'react-modal';
import TodoForm from './TodoForm';
import { useSelector } from 'react-redux';

const CalendarModal = ({ isOpen, onClose, content }) => {
    Modal.setAppElement("#root");
   
    const modalStyle = {
        overlay:{
            position:'fixed',
            top:0, left:0, right:0, bottom:0,
            backgroundColor : 'rgba(0, 0, 0, 0.3)',
            zIndex: 1000
        },
        content:{
            position:'absolute',
            margin:'auto',
            top:'50%',left:'50%',right:'auto',bottom:'auto',
            backgroundColor:'#FFFFFF',
            overflow: 'auto'
        }
    }
    const handleUpdate = () => {
        
    }
    const navigate = useNavigate();
    
    const handleDelete = (id) => {
        axios.delete('/function/schedule/'+id)
        .then(res => {
            console.log(res.data);
            if(res.data){
                navigate(0);    //페이지 새로고침..?
            }
        })
        .catch(err => console.log(err));
    }

    return (
        <Modal 
            style={modalStyle}
            isOpen={isOpen}
            onRequestClose={onClose}
            >
            <input type='text' id="title" value={content.title} /><br/>
            <textarea id="content" value={content.content} ></textarea><br/>
            <input type='datetime-local' id="start" value={content.start}  /><br/>
            <input type='datetime-local' id="end" value={content.end}  /><br/>

            {content.groupId === '1' ? <button onClick={handleUpdate}>수정</button> : <></>}
            {content.groupId === '1' ? <button onClick={()=>handleDelete(content.id)}>삭제</button> : <></>} 
            <button onClick={onClose}>닫기</button>
        </Modal>
    );
}
export default CalendarModal;