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
        return (
            <div className={this.className}>
                <Link className="id" to={url}>{this.props.id + ""}</Link>
                <div className="body">{body}</div>
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

        //HAD TO DO THIS DUMB SHIT WITH THE _ BEUCASE OF SOME DUMBER SHIT WITH WEBPACK OR BABEL OR I DONT FUCKING KNOW FUCK THIS
        let key = 0;
        let elements = [];
        let regExForMsgId = /#([0-9]+)\b/;
        let regExForUsrId = /@([a-zA-z0-9]+)\b/;
        let matchMsg = regExForMsgId.exec(messageText);
        let matchUsr = regExForUsrId.exec(messageText);
        for(;messageText.length > 0;){
            if(matchUsr == null && matchUsr == null){
                elements.push(<div key={key} className="text">{messageText}</div>)
                key++; //lol why not :P
                break;
            } else if (matchMsg.index < matchUsr.index){
                if(matchMsg.index > 0){
                    elements.push(<div key={key} className="text">{messageText.slice(0, matchMsg.index)}</div>);
                    key++;
                    messageText = messageText.slice(matchMsg.index);
                }
                elements.push(<Link key={key} className="link" to={"/post/" + matchMsg[1]}>{matchMsg[0]}</Link>)
                key++;
                messageText = messageText.slice(matchMsg.index + matchMsg[0].length);
            } else if(matchUsr.index < matchMsg.index) {
                if(matchUsr.index > 0){
                    elements.push(<div key={key} className="text">{messageText.slice(0, matchUsr.index)}</div>);
                    key++;
                    messageText = messageText.slice(matchUsr.index);
                }
                elements.push(<Link key={key} className="link" to={"/user/" + matchUsr[1]}>{matchUsr[0]}</Link>)
                key++;
                messageText = messageText.slice(matchUsr[0].length);
            }
            console.log(messageText)
            matchMsg = regExForMsgId.exec(messageText);
            matchUsr = regExForUsrId.exec(messageText);
            console.log(matchUsr)
            console.log(matchMsg)
        }
        return elements
    }
}

Message.propTypes = {
    message: PropTypes.string,
    id: PropTypes.number
};