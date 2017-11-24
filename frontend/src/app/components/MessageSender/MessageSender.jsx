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
        window.postRecaptchaCallback = this.sendMessage.bind(this);
    }

    sendMessage(recaptchaInfo){
        console.log(recaptchaInfo)
        let msg = document.getElementById("messageBody").value;
        document.getElementById("messageBody").value = "";
        $.post('/newMessage', JSON.stringify({
            message: msg,
            recaptchaInfo: recaptchaInfo
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
                <button
                    className="g-recaptcha"
                    disabled={this.state.disabled}
                    data-sitekey="6LckYSAUAAAAANv6iblzpOyzC2zZNLbQ-M5Vlxfj"
                    data-callback="postRecaptchaCallback">
                  Post
                </button>
            </div>
        );
    }
}

MessageSender.propTypes = {
    message: PropTypes.string,
    id: PropTypes.number
};