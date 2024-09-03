import React from 'react';
import BaseOptions from './BaseOptions';
import Input from './Input';

function ChatFooter({ chats, sendMessage, currentThreadId, files, setFiles, changeType, addImageToChat, threadID }) {
  return (
    <div id="chatfooter">
      <div style={{ width: '100%' }}>
        <BaseOptions sendMessage={sendMessage} changeType={changeType} />
        <Input chats={chats} files={files} setFiles={setFiles} sendMessage={sendMessage} threadID={threadID} addImageToChat={addImageToChat} />
      </div>
    </div>
  );
}

export default ChatFooter;
