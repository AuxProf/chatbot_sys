import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import Chat from './Chat';
import ChatList from './ChatList';
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
    const [messages, setMessages] = useState([
        { type: 'bot', content: 'Olá Professor' },
        { type: 'bot', content: 'Como posso lhe ajudar?' }
    ]);
    const [chats, setChats] = useState([
        { id: 1, name: "Chat 1" }
    ]);

    useEffect(() => {
        setMessages([
            { type: 'bot', content: 'Olá Professor' },
            { type: 'bot', content: 'Como posso lhe ajudar?' }
        ]);
    }, []);

    const changeType = (dir) => {
        setGenerateOp(dir === 'r' ? 'img' : 'txt');
    };

    const sendMessage = (text) => {
        if (!disableInput && text.trim() !== "") {
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
        setMessages((prevMessages) => [...prevMessages, { type: 'loading' }]);

        if (generateOp === 'txt') {
            // Simulação de resposta da API (substitua pela lógica real)
        } else {
            setTimeout(() => {
                setMessages((prevMessages) => prevMessages.map((msg) =>
                    msg.type === 'loading' ? { type: 'bot', content: `Resposta ${generateOp} para: ${input}` } : msg
                ));
                setDisableInput(false);
            }, 2000);
        }
    };

    const refresh = () => {
        setMessages([
            { type: 'bot', content: 'Olá Professor' },
            { type: 'bot', content: 'Como posso lhe ajudar?' }
        ]);
        setChatHist([chatHist[0]]);
        setDisableInput(false);
    };

    const handleAddChat = (newChat) => {
        setChats((prevChats) => [...prevChats, newChat]);
    };

    return (
        <div id="chatbot">
            <ChatHeader refresh={refresh} />
            <div id="chatbody">
                <ChatList chats={chats} onAddChat={handleAddChat} />
                <Chat messages={messages} sendMessage={sendMessage} changeType={changeType} />
            </div>
        </div>
    );
}

export default Chatbot;
