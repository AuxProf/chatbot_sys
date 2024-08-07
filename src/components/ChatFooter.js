import React from 'react';
import ScrollDownButton from './ScrollDownButton';
import BaseOptions from './BaseOptions';
import Input from './Input';

function ChatFooter({ sendMessage, changeType }) {
    return (
        <div id="chatfooter">
            <div style={{ width: '100%' }}>
                <ScrollDownButton />
                <BaseOptions sendMessage={sendMessage} changeType={changeType} />
                <Input sendMessage={sendMessage} />
            </div>
        </div>
    );
}

export default ChatFooter;
