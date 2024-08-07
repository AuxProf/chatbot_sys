import React from 'react';

function ScrollDownButton() {
    return (
        <div id="scroll_down">
            <button onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
                <img src="arrow.svg" alt="Scroll Down" />
            </button>
        </div>
    );
}

export default ScrollDownButton;
