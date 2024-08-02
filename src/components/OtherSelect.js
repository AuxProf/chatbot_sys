import React from 'react';
import txtImg from '../assets/txt.svg';
import imgImg from '../assets/img.svg';

function OtherSelect({ changeType }) {
    return (
        <div id="other_select">
            <div id="btt_select_l" className="btt_select_l btt_select_s" onClick={() => changeType('l')}>
                <img src={txtImg} alt="Text" />
            </div>
            <div id="btt_select_r" className="btt_select_r" onClick={() => changeType('r')}>
                <img src={imgImg} alt="Image" />
            </div>
        </div>
    );
}

export default OtherSelect;
