import React, { useState, useEffect } from 'react';
import AddChatButton from './AddChatButton';
import ConfirmDeleteModal from './ConfirmDeleteModal'; 
import trash from '../assets/trash.svg';

const ChatList = ({ chats = [], onAddChat, onDeleteChat }) => {
    const [activeChatId, setActiveChatId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [chatToDelete, setChatToDelete] = useState(null);

    useEffect(() => {
        if (chats.length > 0 && activeChatId === null) {
            setActiveChatId(chats[0].id); // Define o primeiro chat como ativo
        }
    }, [chats, activeChatId]);

    const handleClick = (chat) => {
        setActiveChatId(chat.id);
        console.log(chat);
    };

    const handleDeleteClick = (chat) => {
        setChatToDelete(chat);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = () => {
        if (onDeleteChat && typeof onDeleteChat === 'function') {
            onDeleteChat(chatToDelete.id); // Chama a função para deletar o chat
        } else {
            console.error('onDeleteChat is not a function');
        }
        setShowConfirmModal(false);
        setChatToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowConfirmModal(false);
        setChatToDelete(null);
    };

    return (
        <div style={{ width: '22%', borderRight: '2px solid rgb(31, 31, 35)' }}>
            <AddChatButton onAddChat={onAddChat} />
            <div id="chat_list" style={styles.chatList}>
                {chats.map(chat => (
                    <div
                        key={chat.id}
                        style={{
                            ...styles.chatItem,
                            backgroundColor: chat.id === activeChatId ? 'rgb(31, 31, 35)' : 'transparent',
                            fontWeight: chat.id === activeChatId ? 'bold' : 'normal'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(31, 31, 35)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = chat.id === activeChatId ? 'rgb(31, 31, 35)' : 'transparent'}
                        onClick={() => handleClick(chat)}
                    >
                        {chat.name}
                        <button 
                            style={styles.deleteButton} 
                            onClick={(e) => { 
                                e.stopPropagation(); // Evita que o clique também selecione o chat
                                handleDeleteClick(chat); 
                            }}
                        >
                            <img src={trash} />
                        </button>
                    </div>
                ))}
            </div>
            {showConfirmModal && (
                <ConfirmDeleteModal 
                    onConfirm={handleConfirmDelete} 
                    onCancel={handleCancelDelete} 
                />
            )}
        </div>
    );
};

const styles = {
    chatList: {
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#888 #555',
    },
    chatItem: {
        width: 'auto',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0px 10px 10px',
        transition: 'background-color 0.3s ease, font-weight 0.3s ease',
        position: 'relative'
    },
    deleteButton: {
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'transparent',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        padding: '5px 10px',
    }
};

export default ChatList;
