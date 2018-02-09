import React, { ReactElement } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom'

import './Message.scss';

export class Message extends React.Component {

    constructor() {
        super();
        this.className = "U4ETb8Jej8";
    }

    render () {
        let url = "/post/" + this.props.id
        let body = this.parseMessage(this.props.message)

        let className = "body";
        if(this.props.full){

        }

        return (
            <div className={this.className}>
                <Link className="id" to={url}>{"#" + this.props.id}</Link>
                <pre className="body">{body}</pre>
            </div>
        );
    }

    parseMessage(messageText) {
        /**
         * Method to parse the message body to include links to other posts
         * and other users
         * 
         * @param {string} messageText - The body of the message
         * 
         * @returns {Array<ReactElement>} - The elements to put as the message body
         */

        let key = 0;
        let elements = [];
        let regExForMsgId = /#([0-9]+)\b/;
        let matchMsg = regExForMsgId.exec(messageText);
        for(;messageText.length > 0;){
            if(matchMsg == null){
                elements.push(<div key={key} className="text">{messageText}</div>)
                key++; //lol why not :P
                break;
            } else{
                if(matchMsg.index > 0){
                    elements.push(<div key={key} className="text">{messageText.slice(0, matchMsg.index)}</div>);
                    key++;
                    messageText = messageText.slice(matchMsg.index);
                }
                elements.push(<Link key={key} className="link" to={"/post/" + matchMsg[1]}>{matchMsg[0]}</Link>)
                key++;
                messageText = messageText.slice(matchMsg[0].length);
            }
            matchMsg = regExForMsgId.exec(messageText);
        }
        return elements
    }
}

Message.propTypes = {
    message: PropTypes.string,
    id: PropTypes.number,
    full: PropTypes.bool
};