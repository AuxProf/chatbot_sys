import React, { useState } from 'react';
import sendImg from '../assets/send.svg';
import FilesButton from './FilesButton';

function Input({ chats, sendMessage, setFiles, files, addImageToChat, threadID }) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div id="input">
      <input
        type="text"
        id="main_input"
        placeholder="Digite aqui sua instrução"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <FilesButton chats={chats} files={files} setFiles={setFiles} threadID={threadID} addImageToChat={addImageToChat} />
      <button onClick={handleSend}>
        <img src={sendImg} alt="Send" />
      </button>
    </div>
  );
}

export default Input;
