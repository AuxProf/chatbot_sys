// src/api/histApi.js
const HIST_API_URL = 'http://localhost:3000'; // Mude para o URL de deploy quando necessário
const API_TOKEN = ''; // Mude para o URL de deploy quando necessário

const callAPI = async (method, body) => {
    return await fetch(`${HIST_API_URL}/${endpoint}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_TOKEN}`
            },
            body: JSON.stringify(body)
        });
};