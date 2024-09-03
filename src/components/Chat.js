import React, { useEffect, useRef, useState } from 'react';
import ChatFooter from './ChatFooter';
import arrow from '../assets/arrow.svg';
import MarkdownWithMath from './MarkdownWithMath';

function Chat({ chats, messages, files, setFiles, addImageToChat, sendMessage, changeType, disableInput, loading, threadID }) {
    const chatRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    useEffect(() => {
        const chatElement = chatRef.current;
        if (chatElement) {
            chatElement.scrollTop = chatElement.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const handleScroll = () => {
            if (chatRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
                setShowScrollButton(scrollTop + clientHeight < scrollHeight - 200);
            }
        };

        const chatElement = chatRef.current;
        if (chatElement) {
            chatElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (chatElement) {
                chatElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const scrollDown = () => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <div id="chat" ref={chatRef} style={{ minHeight: '500px', maxHeight: '500px', overflow: 'auto', padding: '20px', borderTop: '1px solid rgb(31, 31, 35)' }}>
                {loading ? (
                    <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <div className="loading-ball"></div>
                        <div className="loading-ball"></div>
                        <div className="loading-ball"></div>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} style={{ padding: msg.type === 'loading' || msg.isUrl ? '20px' : '0px 20px' }} className={`mensage ${msg.type === 'user' ? 'my_mensage' : 'bot_mensage'}`}>
                            {msg.type === 'loading' ? (
                                <div className="loading-container">
                                    <div className="loading-ball"></div>
                                    <div className="loading-ball"></div>
                                    <div className="loading-ball"></div>
                                </div>
                            ) : msg.isUrl ? (
                                <a href={msg.content} target="_blank" rel="noopener noreferrer">
                                    <img src={msg.content} alt="Imagem gerada" className="chat-image" />
                                </a>
                            ) : (
                                <MarkdownWithMath text={msg.content} />

                            )}
                        </div>
                    ))
                )}
            </div>
            <ChatFooter
                threadID={threadID}
                chats={chats}
                files={files}
                setFiles={setFiles}
                addImageToChat={addImageToChat}
                sendMessage={sendMessage}
                changeType={changeType}
                disableInput={disableInput}
            />
            {showScrollButton && (
                <button style={styles.scrollButton} onClick={scrollDown}>
                    <img src={arrow} alt="Scroll down" />
                </button>
            )}
        </div>
    );
}

const styles = {
    scrollButton: {
        position: 'absolute',
        bottom: '70px',
        right: '10px',
        backgroundColor: 'transparent',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        padding: '10px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatImage: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '5px',
        marginTop: '5px',
    }
};

export default Chat;
