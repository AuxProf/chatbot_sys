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
    const [chats, setChats] = useState([]);

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        setMessages([
            { type: 'bot', content: 'Olá Professor' },
            { type: 'bot', content: 'Como posso lhe ajudar?' }
        ]);
    }, []);

    const fetchChats = async () => {
        try {
            const response = await fetch('http://localhost:8000/gpt/user/2de67e94-88f5-4a53-8a84-b49d9c565e9e', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjMzMDAyNzU4NjYsImxvZ2luIjoiYSJ9.iSlwVK2mFiGrl8EvjEnRl9o7aXtgNRGW2vPGRm53ceI',
                    'Content-Type': 'application/json'
                },
                mode: 'cors' 
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar a lista de chats');
            }

            const data = await response.json();
            setChats(data.chats); // Supondo que a resposta seja um array de chats
        } catch (error) {
            console.error('Erro ao buscar chats:', error);
        }
    };

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
        // TODO: Adicionar lógica de criação de chat no backend usando fetch
    };

    const handleDeleteChat = (chatId) => {
        setChats((prevChats) => prevChats.filter(chat => chat.thread_id !== chatId));
        // TODO: Adicionar lógica de deleção de chat no backend usando fetch
    };

    const addImageToChat = (imageUrl) => {
        sendMessage(imageUrl); // Enviar imagem como mensagem do usuário
    };

    return (
        <div id="chatbot">
            <ChatHeader refresh={refresh} />
            <div id="chatbody">
                <ChatList
                    chats={chats}
                    onAddChat={handleAddChat}
                    onDeleteChat={handleDeleteChat} // Passando a função para o ChatList
                />
                <Chat
                    messages={messages}
                    sendMessage={sendMessage}
                    changeType={changeType}
                    addImageToChat={addImageToChat}
                />
            </div>
        </div>
    );
}

export default Chatbot;
