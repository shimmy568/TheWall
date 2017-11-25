import React from 'react';
import PropTypes from 'prop-types';

import { MessagesBox } from './../../components/MessagesBox/MessagesBox.jsx';
import { MessageSender } from './../../components/MessageSender/MessageSender.jsx';

export class Home extends React.Component {

    render(){
        return (
            <div>
                <MessageSender/>
                <MessagesBox/>
            </div>  
        )      
    }
}