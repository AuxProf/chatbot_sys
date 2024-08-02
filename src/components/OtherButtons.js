import React from 'react';

function OtherButtons({ sendMessage }) {
    return (
        <div id="other_buttons">
            <button onClick={() => sendMessage('Gere um Planos de Aula')}>
                Gerar Planos de Aula
            </button>
            <button onClick={() => sendMessage('Gere um Planos de Ensino')}>
                Gerar Planos de Ensino
            </button>
            <button onClick={() => sendMessage('Gere uma Lista de Exercícios')}>
                Gerar Lista de Exercícios
            </button>
            <button onClick={() => sendMessage('Gere Avaliações')}>
                Gerar Avaliações
            </button>
        </div>
    );
}

export default OtherButtons;
