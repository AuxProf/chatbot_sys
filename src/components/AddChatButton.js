import React, { useState } from 'react';
import write from '../assets/write.svg';
import './AddChatButton.css'; // Para os estilos do modal

function AddChatButton() {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');

    const handleButtonClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Chame sua API aqui com o valor de `name`
        console.log('Nome enviado:', name);
        // Feche o modal após o envio
        setShowModal(false);
    };

    return (
        <div id="addchat">
            <button onClick={handleButtonClick}>
                Novo Chat <img src={write} alt="Send" />
            </button>
            {showModal && (
                <div className="modal_create_chat">
                    <div className="modal_create_chat_content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <form onSubmit={handleSubmit}>
                            <label>
                                <input placeholder='Nome' type="text" value={name} onChange={handleInputChange} />
                            </label>
                            <button type="submit">Enviar</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddChatButton;
