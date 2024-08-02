import React, { useEffect, useRef } from 'react';

function Chat({ messages }) {
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div id="chat" ref={chatRef}>
            {messages.map((msg, index) => (
                <div key={index} className={`mensage ${msg.type === 'user' ? 'my_mensage' : 'bot_mensage'}`}>
                    {msg.type === 'loading' ? <img src="https://i.gifer.com/YlWC.gif" alt="Loading" /> : msg.content}
                </div>
            ))}
        </div>
    );
}

export default Chat;
