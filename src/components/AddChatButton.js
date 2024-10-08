import React, { useState } from 'react';
import write from '../assets/write.svg';
import './AddChatButton.css'; // Para os estilos do modal

function AddChatButton({ onAddChat }) {
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');

    const handleButtonClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        setTitle(e.target.value);
    };

    const generateUniqueId = () => {
        return Date.now(); // Pode ser substituído por qualquer outro método para garantir unicidade
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim() !== '') {
            const newChat = {
                thread_id: generateUniqueId(),
                title
            };
            if (onAddChat && typeof onAddChat === 'function') {
                onAddChat(newChat); // Passa o novo chat para o pai
            } else {
                console.error('onAddChat is not a function');
            }
            setTitle('');
            setShowModal(false);
        }
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
                                <input placeholder="Nome" type="text" value={title} onChange={handleInputChange} />
                            </label>
                            <button type="submit">Criar Novo Chat</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddChatButton;
