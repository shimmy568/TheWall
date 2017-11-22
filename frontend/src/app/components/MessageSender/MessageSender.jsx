import React from 'react';
import PropTypes from 'prop-types';

import './MessageSender.scss';

export class MessageSender extends React.Component {

    constructor() {
        super();
        this.className = "936KgYjDtH";
    }

    render () {
        return (
            <div className={this.className}>
                <input type="text"/>
                <button>Post</button>
            </div>
        );
    }
}

MessageSender.propTypes = {
    message: PropTypes.string,
    id: PropTypes.number
};