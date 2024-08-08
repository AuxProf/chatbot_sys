import React from 'react';
import './Modal.css'; // Certifique-se de que o estilo do modal esteja aplicado

const ConfirmDeleteModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal_content">
        <span className="close" onClick={onCancel}>&times;</span>
        <p>Tem certeza que deseja apagar esse chat?</p>
        <div className='double-buttom-sec'>
          <button className="form-buttom" onClick={onConfirm}>Sim</button>
          <button className="form-buttom" onClick={onCancel}>Não</button>
          </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
