import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import './MessageSender.scss';

export class MessageSender extends React.Component {

    constructor() {
        super();
        this.className = "a36KgYjDtH";
        this.state = {
            disabled: false
        }
    }

    sendMessage(){
        let msg = document.getElementById("messageBody").value;
        document.getElementById("messageBody").value = "";
        $.post('/newMessage', JSON.stringify({
            message: msg
        }), (data, status) => {
            console.log(data);
            console.log(status);
        });
        this.setState({
            disabled: true
        })
        window.setTimeout(() => {
            this.setState({
                disabled: false
            });
        }, 3500);
    }

    render () {
        return (
            <div className={this.className}>
                <textarea id="messageBody" cols="50" rows="5"></textarea>
                <button disabled={this.state.disabled} onClick={this.sendMessage.bind(this)}>Post</button>
            </div>
        );
    }
}

MessageSender.propTypes = {
    message: PropTypes.string,
    id: PropTypes.number
};