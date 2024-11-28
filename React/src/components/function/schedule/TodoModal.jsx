import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import Modal from 'react-modal';
import TodoForm from './TodoForm';

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
        
    }

    return (
        <Modal 
            style={modalStyle}
            isOpen={isOpen}
            onRequestClose={onClose}
            >
            <TodoForm onClose={onClose}></TodoForm>    
        </Modal>
    );
}
export default CalendarModal;