import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import Chat from './Chat';
import './styles.css';
import ChatList from './ChatList';
// import { sendMessage } from '../api/gptApi';

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
        // Simulação de resposta da API (substitua pela lógica real)
        setMessages((prevMessages) => [...prevMessages, { type: 'loading' }]);

        if (generateOp === 'txt') {
            // try {
            //     // Chamar a função sendMessage
            //     const response = await sendMessage(null, null, input);

            //     // Atualizar as mensagens com a resposta da API
            //     setMessages((prevMessages) =>
            //         prevMessages.map((msg) =>
            //             msg.type === 'loading' ? { type: 'bot', content: `Resposta do bot: ${response}` } : msg
            //         )
            //     );
            // } catch (error) {
            //     console.error('Erro ao enviar mensagem:', error);
            //     setMessages((prevMessages) =>
            //         prevMessages.map((msg) =>
            //             msg.type === 'loading' ? { type: 'bot', content: 'Erro ao obter resposta do bot' } : msg
            //         )
            //     );
            // } finally {
            //     setDisableInput(false);
            // }
        } else {
            // Simular a resposta do bot após 2 segundos
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

    var chats = [];

    return (
        <div id="chatbot">
            <ChatHeader refresh={refresh} />
            <div id="chatbody">
                <ChatList refresh={chats} />
                <Chat messages={messages} sendMessage={sendMessage} changeType={changeType} />
            </div>
        </div>
    );
}

export default Chatbot;
