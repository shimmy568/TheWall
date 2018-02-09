import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import './MessageSender.scss';

export class MessageSender extends React.Component {

    constructor() {
        super();
        this.className = "a36KgYjDtH";
        this.state = {
            disabled: false,
            hasSession: false
        }
        window.postRecaptchaCallback = this.sendMessageRecaptcha.bind(this);
    }

    sendMessageRecaptcha(recaptchaInfo){
        let msg = document.getElementById("messageBody").value;
        document.getElementById("messageBody").value = "";
        $.post('/newMessage', JSON.stringify({
            message: msg,
            recaptchaInfo: recaptchaInfo
        }), (data, status) => {

        });
        this.setState({
            disabled: true,
            hasSession: true
        })
        window.setTimeout(window.updateMessages, 500);
        window.setTimeout(() => {
            this.setState({
                disabled: false
            });
        }, 3500);
    }

    sendMessageSession(){
        let msg = document.getElementById("messageBody").value;
        document.getElementById("messageBody").value = "";
        $.post('/newMessage', JSON.stringify({
            message: msg
        }), (data, status) => {

        });
        this.setState({
            disabled: true
        })
        window.setTimeout(() => {
            window.updateMessages(msg)
        }, 800);
        window.setTimeout(() => {
            this.setState({
                disabled: false
            });
        }, 3500);
    }

    render () {
        let button = (
        <button
            className="g-recaptcha"
            disabled={this.state.disabled}
            data-sitekey="6LckYSAUAAAAANv6iblzpOyzC2zZNLbQ-M5Vlxfj"
            data-callback="postRecaptchaCallback">
          Post
        </button>
        );
        if(this.state.hasSession){
            button = (<button disabled={this.state.disabled} onClick={this.sendMessageSession.bind(this)}>Post</button>);
        }
        return (
            <div className={this.className}>
                <textarea id="messageBody" cols="50" rows="5"></textarea>
                {button}
            </div>
        );
    }
}

MessageSender.propTypes = {
    message: PropTypes.string,
    id: PropTypes.number
};