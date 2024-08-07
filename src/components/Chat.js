import React, { useEffect, useRef } from 'react';
import ChatFooter from './ChatFooter';

function Chat({ messages, sendMessage, changeType }) {
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);


    return (
        <div style={{ width: '100%' }}>

            <div id="chat" ref={chatRef}>
                {messages.map((msg, index) => (
                    <div key={index} className={`mensage ${msg.type === 'user' ? 'my_mensage' : 'bot_mensage'}`}>
                        {msg.type === 'loading' ? (
                            <div className="loading-container">
                                <div className="loading-ball"></div>
                                <div className="loading-ball"></div>
                                <div className="loading-ball"></div>
                            </div>
                        ) : (
                            msg.content
                        )}
                    </div>
                ))}
            </div>

            <ChatFooter sendMessage={sendMessage} changeType={changeType} />
        </div>
    );
}

export default Chat;
