import React from 'react';
import PropTypes from 'prop-types';

import './Message.scss';

export class Message extends React.Component {

    constructor() {
        super();
        this.className = "U4ETb8Jej8";
    }

    render () {
        return (
            <div className={this.className}>
                <div className="id">{this.props.id}</div>
                <div className="body">{this.props.message}</div>
            </div>
        );
    }
}

Message.propTypes = {
    message: PropTypes.string,
    id: PropTypes.number
};