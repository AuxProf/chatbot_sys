import React from 'react';
import baseImg from '../assets/base_img.png';
import refreshImg from '../assets/refresh.svg';

function ChatHeader({ refresh }) {
    return (
        <div id="chatheader">
            <div id="base_info">
                <img src={baseImg} width="48" height="48" alt="Base" />
                <h3>Aux prof</h3>
            </div>
            <div id="base_options">
                <button id="refresh_btn" onClick={refresh}>
                    <img src={refreshImg} alt="Refresh" />
                </button>
            </div>
        </div>
    );
}

export default ChatHeader;
