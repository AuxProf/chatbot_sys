import React from 'react';
import AddChatButton from './AddChatButton';

function ChatList({ chats }) {
    return (
        <div style={{ width: '22%' }}>
            <div id="chat_list">
            </div>
            <AddChatButton />
        </div>
    );
}

export default ChatList;