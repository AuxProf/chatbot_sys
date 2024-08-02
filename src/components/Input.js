import React, { useState } from 'react';
import sendImg from '../assets/send.svg';

function Input({ sendMessage }) {
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
            <button onClick={handleSend}>
                <img src={sendImg} alt="Send" />
            </button>
        </div>
    );
}

export default Input;
