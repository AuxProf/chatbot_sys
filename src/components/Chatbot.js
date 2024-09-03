import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import Chat from './Chat';
import ChatList from './ChatList';
import Cookies from 'js-cookie';
import './styles.css';

function Chatbot({ chats, files, setFiles, setChats }) {
    const [generateOp, setGenerateOp] = useState('txt');
    const [disableInput, setDisableInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', content: 'Olá Professor' },
        { type: 'bot', content: 'Como posso lhe ajudar?' }
    ]);
    const [currentThreadId, setCurrentThreadId] = useState('');

    const changeType = (dir) => {
        setGenerateOp(dir === 'r' ? 'img' : 'txt');
    };

    const sendMessage = async (text) => {
        if (!disableInput && text.trim() !== "") {

            setDisableInput(true);

            try {

                // Adicionar a mensagem de carregamento antes de iniciar o fetch
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { type: 'user', content: text }, // Adiciona a mensagem do usuário
                    { type: 'loading' } // Adiciona a mensagem de carregamento
                ]);
                const response = await fetch(`${process.env.REACT_APP_HISTORIC_SYS_URL}message/${generateOp}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        thread_id: currentThreadId,
                        text: text
                    }),
                    mode: 'cors'
                });

                if (response.status !== 200) {
                    console.error(`Erro ao enviar mensagem: ${response.statusText}`);
                    return;
                }

                if (generateOp === 'txt') {
                    await waitForResponse();
                } else {
                    const data = await response.json();
                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg.type === 'loading' ? { type: 'bot', content: data.text, isUrl: true } : msg
                        )
                    );
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
            } finally {
                setDisableInput(false); // Reabilita a entrada
            }
        }
    };

    const sendImage = async (url) => {
        if (!disableInput) {

            setDisableInput(true);

            try {

                setMessages((prevMessages) => [
                    ...prevMessages,
                    { type: 'user', content: url, isUrl: true },
                    { type: 'loading' }
                ]);
                await fetch(`${process.env.REACT_APP_HISTORIC_SYS_URL}message/img/send`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        thread_id: currentThreadId,
                        url: url
                    }),
                    mode: 'cors'
                });

                await waitForResponse();
            } catch (error) {
                console.error("Erro na requisição:", error);
            } finally {
                setDisableInput(false); // Reabilita a entrada
            }
        }
    };

    const waitForResponse = async () => {
        let responseReceived = false;
        var timer = 0;
        var trys = 0;

        while (!responseReceived) {
            timer++;
            const response = await fetch(`${process.env.REACT_APP_HISTORIC_SYS_URL}chat/last/${currentThreadId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });

            const data = await response.json();

            if (data.length === 0) {
                // Se não houver mensagem, continue aguardando
                continue;
            }

            const latestMessage = data[0];

            if (latestMessage.role !== 'user' && latestMessage.text !== '') {
                // Substituir a mensagem de carregamento pela mensagem recebida
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.type === 'loading' ? {
                            type: 'bot',
                            content: latestMessage.text,
                            isUrl: false
                        } : msg
                    )
                );
                responseReceived = true;
            }
            else if (trys > 3) {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.type === 'loading' ? {
                            type: 'bot',
                            content: 'Erro ao enviar mensagem',
                            isUrl: false
                        } : msg
                    )
                );
                responseReceived = true;
            }
            else if (timer === 10) {
                await new Promise(resolve => setTimeout(resolve, 1000 * trys));
                timer = 0;
                trys++;
            }
        }

        setDisableInput(false);
    };

    const refresh = async () => {
        setMessages([
            { type: 'bot', content: 'Olá Professor' },
            { type: 'bot', content: 'Como posso lhe ajudar?' }
        ]);
        await fetch(`${process.env.REACT_APP_HISTORIC_SYS_URL}chat/refresh/${currentThreadId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        });
        setDisableInput(false);
    };

    const handleAddChat = async (newChat) => {
        const user_id = Cookies.get('user_email_id');

        try {
            const response = await fetch(`${process.env.REACT_APP_HISTORIC_SYS_URL}chat`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({
                    title: newChat.title,
                    user_id: user_id
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao adicionar o chat');
            }

            const createdChat = await response.json(); // Obter o chat criado da resposta

            // Adicionar o novo chat à lista de chats
            setChats((prevChats) => [...prevChats, createdChat]);

        } catch (error) {
            console.error('Erro ao adicionar chat:', error);
        }
    };

    const handleDeleteChat = async (chatId) => {
        try {
            // Enviar a requisição para deletar o chat
            const response = await fetch(`${process.env.REACT_APP_HISTORIC_SYS_URL}chat/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                // Se a resposta não for bem-sucedida, lance um erro
                throw new Error(`Erro ao deletar o chat: ${response.statusText}`);
            }

            // Atualizar o estado removendo o chat deletado
            setChats((prevChats) => prevChats.filter(chat => chat.thread_id !== chatId));

        } catch (error) {
            console.error('Erro ao deletar chat:', error);
        }
    };

    const handleSelectChat = async (chat) => {
        try {
            setLoading(true);
            setDisableInput(true);
            setCurrentThreadId(chat.thread_id); // Atualiza o ID da thread atual
            setMessages([]); // Limpa as mensagens atuais ao trocar de chat

            const response = await fetch(`${process.env.REACT_APP_HISTORIC_SYS_URL}chat/${chat.thread_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });

            if (!response.ok) {
                console.error(`Erro: ${response.statusText}`);
                return;
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Resposta não é JSON:", await response.text());
                return;
            }

            const data = await response.json();
            let formattedMessages = data.map(msg => ({
                type: msg.role === 'user' ? 'user' : 'bot',
                content: msg.text,
                isUrl: isUrl(msg.text)
            }));

            if (formattedMessages.length === 0) {
                formattedMessages = [
                    { type: 'bot', content: 'Olá Professor' },
                    { type: 'bot', content: 'Como posso lhe ajudar?' }
                ];
            }

            setMessages(formattedMessages);
        } catch (error) {
            console.error("Erro ao carregar mensagens:", error);
        } finally {
            setLoading(false);
            setDisableInput(false);
        }
    };

    const isUrl = (text) => {
        const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
        return typeof text === 'string' && urlPattern.test(text);
    };

    return (
        <div id="chatbot">
            <ChatHeader refresh={refresh} />
            <div id="chatbody">
                <ChatList
                    chats={chats}
                    onAddChat={handleAddChat}
                    onDeleteChat={handleDeleteChat}
                    onSelectChat={handleSelectChat}
                />
                {chats.length > 0 && (
                    <Chat
                        chats={chats}
                        files={files}
                        setFiles={setFiles}
                        messages={messages}
                        sendMessage={sendMessage}
                        changeType={changeType}
                        disableInput={disableInput}
                        loading={loading}
                        addImageToChat={sendImage}
                        threadID={currentThreadId}
                    />
                )}
            </div>
        </div>
    );
}

export default Chatbot;
