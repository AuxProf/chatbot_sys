import React, { useState } from 'react';
import txtImg from '../assets/txt.svg';
import imgIco from '../assets/img.svg';

function OtherSelect({ changeType }) {
    const [selected, setSelected] = useState('l'); // Estado para controlar o botão selecionado

    const handleChangeType = (dir) => {
        setSelected(dir);
        changeType(dir);
    };

    return (
        <div id="other_select">
            <div
                id="btt_select_l"
                className={`btt_select_l ${selected === 'l' ? 'btt_select_s' : ''}`}
                onClick={() => handleChangeType('l')}
            >
                <img src={txtImg} alt="Receber texto" />
            </div>
            <div
                id="btt_select_r"
                className={`btt_select_r ${selected === 'r' ? 'btt_select_s' : ''}`}
                onClick={() => handleChangeType('r')}
            >
                <img src={imgIco} alt="Receber imagem" />
            </div>
        </div>
    );
}


export default OtherSelect;
