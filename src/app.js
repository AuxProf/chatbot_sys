import React, { useState, useEffect, useRef } from 'react';
import Chatbot from './components/Chatbot';
import Login from './components/Login/Login';
import Cookies from 'js-cookie';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [chats, setChats] = useState([]); // State para armazenar a lista de chats
    const [files, setFiles] = useState([]);
    const hasFetchedChats = useRef(false);

    useEffect(() => {
        const email = Cookies.get('email');
        if (email && !hasFetchedChats.current) {
            fetchChats(email);
            testeGpt();
            hasFetchedChats.current = true; 
        }
    }, []);

    const handleLogin = async (email) => {
        const success = await fetchChats(email);
        hasFetchedChats.current = true; 
        testeGpt();
        return success;
    };

    const fetchChats = async (email) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HISTORIC_SYS_URL}user/${email}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });

            if (response.status === 500) {
                return false;
            }

            if (!response.ok) {
                setIsLoggedIn(false);
                return false;
            }

            const data = await response.json();
            const mappedChats = data.chats.map(chat => ({
                ...chat
            }));
            const mappedFiles = data.files.map(file => ({
                ...file
            }));
            const user_email_id = Cookies.get('user_email_id');
            if (!user_email_id) {
                Cookies.set('user_email_id', data.id);
            }

            Cookies.set('email', email);
            setChats(mappedChats);
            setFiles(mappedFiles); // Atualiza o estado com a lista de chats mapeada
            setIsLoggedIn(true);
            return true;
        } catch (error) {
            console.error('Erro ao buscar chats:', error);
            setIsLoggedIn(false);
            return false;
        }
    };

    const testeGpt = async () => {
        try {
            const response = await fetch(`https://api.openai.com/v1/files`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_GPT_URL}`,
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Erro ao buscar chats:', error);
        }
    };

    return (
        <div className="App">
            {isLoggedIn ? <Chatbot files={files} chats={chats} setFiles={setFiles} setChats={setChats} /> : <Login onLogin={handleLogin} />}
        </div>
    );
}

export default App;
