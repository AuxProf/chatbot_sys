import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import Chat from './Chat';
import Input from './Input';
import OtherButtons from './OtherButtons';
import OtherSelect from './OtherSelect';
import './styles.css';

function Chatbot() {
    const [generateOp, setGenerateOp] = useState('txt');
    const [disableInput, setDisableInput] = useState(false);
    const [chatHist, setChatHist] = useState([
        {
            role: 'system',
            content: 'Role and Goal: Este GPT encarna um educador experiente...'
        }
    ]);
    const [messages, setMessages] = useState([]);

    const changeType = (dir) => {
        setGenerateOp(dir === 'r' ? 'img' : 'txt');
    };

    const sendMessage = (text) => {
        if (!disableInput && text.trim() != "") {
            setDisableInput(true);
            placeAsking(text);
        }
    };

    const placeAsking = (input) => {
        if (input == null) {
            const inputElement = document.getElementById('main_input');
            input = inputElement.value;
            inputElement.value = "";
        }

        setMessages((prevMessages) => [...prevMessages, { type: 'user', content: input }]);
        placeAnswer(input);
    };

    const placeAnswer = async (input) => {
        // Simulação de resposta da API (substitua pela lógica real)
        setMessages((prevMessages) => [...prevMessages, { type: 'loading' }]);

        // Simular a resposta do bot após 2 segundos
        setTimeout(() => {
            setMessages((prevMessages) => prevMessages.map((msg) =>
                msg.type === 'loading' ? { type: 'bot', content: `Resposta ${generateOp} para: ${input}` } : msg
            ));
            setDisableInput(false);
        }, 2000);
    };

    const refresh = () => {
        setMessages([]);
        setChatHist([chatHist[0]]);
    };


    return (
        <div id="chatbot">
            <ChatHeader refresh={refresh} />
            <Chat messages={messages} />
            <div id="scroll_down">
                <button onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
                    <img src="arrow.svg" alt="Scroll Down" />
                </button>
            </div>
            <div id="base_options">
                <OtherButtons sendMessage={sendMessage} />
                
                <OtherSelect changeType={changeType} />
            </div>
            <Input sendMessage={sendMessage} />
        </div>
    );
}

export default Chatbot;
