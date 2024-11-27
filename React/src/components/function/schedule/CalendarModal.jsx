import { useState } from 'react';
import Modal from 'react-modal';

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
    
    return (
        <Modal 
            style={modalStyle}
            isOpen={isOpen}
            onRequestClose={onClose}
            >
            <h2>{content.title}</h2>
            <p>{content.content}</p>
            <button onClick={onClose}>닫기</button>
        </Modal>
    );
}
export default CalendarModal;