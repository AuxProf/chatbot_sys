import React, { useEffect, useRef, useState } from 'react';
import ChatFooter from './ChatFooter';
import arrow from '../assets/arrow.svg';

function Chat({ messages, sendMessage, changeType, addImageToChat }) {
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
        {messages.map((msg, index) => (
          <div key={index} className={`mensage ${msg.type === 'user' ? 'my_mensage' : 'bot_mensage'}`}>
            {msg.type === 'loading' ? (
              <div className="loading-container">
                <div className="loading-ball"></div>
                <div className="loading-ball"></div>
                <div className="loading-ball"></div>
              </div>
            ) : msg.content.startsWith('blob:') ? (
              <img src={msg.content} alt="User uploaded" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            ) : (
              msg.content
            )}
          </div>
        ))}
      </div>

      <div id="scroll_down" style={{ position: 'relative', padding: '10px', borderTop: '1px solid rgb(31, 31, 35)' }}>
        {showScrollButton && (
          <button
            onClick={scrollDown}
            className={showScrollButton ? 'show' : ''}
          >
            <img src={arrow} alt="Scroll Down" />
          </button>
        )}
      </div>

      <ChatFooter sendMessage={sendMessage} changeType={changeType} addImageToChat={addImageToChat} />
    </div>
  );
}

export default Chat;
