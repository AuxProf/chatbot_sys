import React, { useState, useEffect } from 'react';
import AddChatButton from './AddChatButton';

const ChatList = ({ chats = [], onAddChat }) => {
    const [activeChatId, setActiveChatId] = useState(null);

    useEffect(() => {
        if (chats.length > 0 && activeChatId === null) {
            setActiveChatId(chats[0].id); // Define o primeiro chat como ativo
        }
    }, [chats, activeChatId]);

    const handleClick = (chat) => {
        setActiveChatId(chat.id);
        console.log(chat);
    };

    return (
        <div style={{ width: '22%' }}>
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
                    </div>
                ))}
            </div>
            <AddChatButton onAddChat={onAddChat} />
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
        transition: 'background-color 0.3s ease, font-weight 0.3s ease'
    }
};

export default ChatList;
