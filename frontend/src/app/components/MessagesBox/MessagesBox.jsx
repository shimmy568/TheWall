import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import './MessagesBox.scss';

export class MessagesBox extends React.Component {

    constructor() {
        super();
        this.className = "m1x5KS5PJo";
    }

    getMessages(cb){
        $.post('/getMessages', {}, (data, status) => {
            console.log(data);
            console.log(status);
        });
    }

    render () {
        return (
            <div className={this.className}>
                <button onClick={this.getMessages}>Get Shti</button>
            </div>
        );
    }
}