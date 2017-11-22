import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

import { MessagesBox } from './components/MessagesBox/MessagesBox.jsx';
import { MessageSender } from './components/MessageSender/MessageSender.jsx';

ReactDOM.render(
    <div>
        <MessageSender/>
        <MessagesBox/>
    </div>
    , document.getElementById('root'));
