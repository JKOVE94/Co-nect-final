// components/ConfirmModal.js  // 확인 / 취소 modal 창 
import React, { useEffect } from 'react';   

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {     
    if (!isOpen) return null;        

    return (       
      <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>         
        <div className="modal-dialog" style={{            
            position: 'relative',           
            top: '35%',  // 상단에서의 거리를 조절 (기본값: 20%)           
            maxWidth: '500px',           
            margin: '0 auto'         
        }}>           
          <div className="modal-content">             
            <div className="modal-header">               
              <h5 className="modal-title">{title}</h5>               
              <button                  
                type="button"                 
                className="btn-close"                  
                onClick={onClose}                 
                aria-label="Close"               
              />             
            </div>             
            <div className="modal-body">               
              <p>{message}</p>             
            </div>             
            <div className="modal-footer">               
              <button                  
                type="button"                  
                className="btn btn-primary"                  
                onClick={onConfirm}               
              >                 
                확인               
              </button>               
              <button                  
                type="button"                  
                className="btn btn-secondary"                  
                onClick={onClose}               
              >                 
                취소               
              </button>             
            </div>           
          </div>         
        </div>       
      </div>     
    );   
};  

export default ConfirmModal;