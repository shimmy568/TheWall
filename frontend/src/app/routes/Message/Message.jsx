import React from 'react';
import PropTypes from 'prop-types';

import {Message} from './../../components/Message/Message.jsx';

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