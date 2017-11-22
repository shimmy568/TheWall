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
            messages: null
        }
    }

    getMessages(cb){
        $.post('/getMessages', {}, (data, status) => {
            cb(data);
        });
    }

    render () {
        let body = <div className="loading">Loading...</div>;
        if(this.state.messages == null){
            this.getMessages((data) => {
                this.setState({
                    messages: data
                });
            });
        } else {
            body = [];
            for(let i = 0; i < this.state.messages.length; i++){
                body.push(<Message key={i} message={this.state.messages[i].message} id={this.state.messages[i].id}/>);
            }
        }

        return (
            <div className={this.className}>
                {body}
            </div>
        );
    }
}