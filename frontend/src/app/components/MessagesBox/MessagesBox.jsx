import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import './MessagesBox.scss';

import { Message } from "./../Message/Message.jsx";

export class MessagesBox extends React.Component {

    constructor() {
        super();
        this.className = "m1x5KS5PJo";
        this.state = {
            messages: null,
            time: 0
        }
        this.updateTimeoutID = -1;
        window.updateMessages = this.updateMessages.bind(this)
    }

    getMessages(cb) {
        $.post('/getMessages', {}, (data, status) => {
            cb(data);
            this.updateTimeoutID = window.setTimeout(this.updateMessages.bind(this), 1000)
        });
    }

    /**
     * Updates the messages without requesting all 100
     * @author Owen Anderson
     * 
     * @param {string} newmsg - Used to pass in the message that was sent
     */
    updateMessages(newmsg) {
        window.clearTimeout(this.updateTimeoutID) //Prevent the timeout from going twice if it's called from the message sender
        $.ajax({
            type: "POST",
            beforeSend: function (request) {
                request.setRequestHeader("Content-Type", "application/json");
            },
            url: "/updateMessages",
            data: JSON.stringify({
                LastUpdate: this.state.time || 0
            }),
            processData: false,
            success: (data, status) => {
                //If len == 0 then there were no new messages to put out
                if (data['messages'].length > 0) {
                    let newMsgs = data['messages'].concat(this.state.messages)
                    newMsgs = newMsgs.slice(0, 100);
                    this.setState({
                        messages: newMsgs,
                        time: data['time']
                    });
                }
                this.updateTimeoutID = window.setTimeout(this.updateMessages.bind(this), 10000)
            }
        });
    }

    render() {
        let body = <div className="loading">Loading...</div>;
        if (this.state.messages == null) {
            this.getMessages((data) => {
                this.setState({
                    messages: data["messages"],
                    time: data["time"]
                });
            });
        } else {
            body = [];
            for (let i = 0; i < this.state.messages.length; i++) {
                body.push(<Message key={i} message={this.state.messages[i].message} id={this.state.messages[i].id} />);
            }
        }

        return (
            <div className={this.className}>
                {body}
            </div>
        );
    }
}