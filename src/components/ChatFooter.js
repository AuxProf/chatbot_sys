import React from 'react';
import BaseOptions from './BaseOptions';
import Input from './Input';

function ChatFooter({ sendMessage, changeType, addImageToChat }) {
  return (
    <div id="chatfooter">
      <div style={{ width: '100%' }}>
        <BaseOptions sendMessage={sendMessage} changeType={changeType} />
        <Input sendMessage={sendMessage} addImageToChat={addImageToChat} />
      </div>
    </div>
  );
}

export default ChatFooter;
