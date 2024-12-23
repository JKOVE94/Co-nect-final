// components/AlertModal.js
//알림용 modal 창
import React, { useEffect } from 'react';

const AlertModal = ({ isOpen, title, message, duration = 2000, setIsOpen }) => { //duration :2초 뒤 자동 닫힘
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);  // onClose 대신 직접 state 변경
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" style={{ 
        position: 'relative',
        top: '40%',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
          </div>
          <div className="modal-body">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;