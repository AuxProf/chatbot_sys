import React from 'react';
import OtherButtons from './OtherButtons';
import OtherSelect from './OtherSelect';

function BaseOptions({ sendMessage, changeType }) {
    return (
        <div id="base_options">
            <OtherButtons sendMessage={sendMessage} />
            <OtherSelect changeType={changeType} />
        </div>
    );
}

export default BaseOptions;
