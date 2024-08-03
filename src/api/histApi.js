// src/api/histApi.js
const HIST_API_URL = 'http://localhost:3000'; // Mude para o URL de deploy quando necessário

export const getHistData = async (endpoint) => {
    try {
        const response = await fetch(`${HIST_API_URL}/${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro na resposta da API local');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar dados da API local:', error);
        throw error;
    }
};

export const postHistData = async (endpoint, data) => {
    try {
        const response = await fetch(`${HIST_API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar dados para a API local');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao enviar dados para a API local:', error);
        throw error;
    }
};
