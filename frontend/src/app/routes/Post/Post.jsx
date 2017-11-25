import React from 'react';
import PropTypes from 'prop-types';

import { Message } from './../../components/Message/Message.jsx';

import $ from 'jquery';

export class Post extends React.Component {

    constructor(){
        super()
        this.state = {
            message: null,
            found: true
        };
    }

    getMessage(id){
        $.ajax({
            type: "POST",
            url: "/getMessage",
            data: JSON.stringify({id: parseInt(id, 10)}),
            success: this.succCallback.bind(this),
            error: this.errorCallback.bind(this)
          });
    }

    //succ
    succCallback(data){
        this.setState({
            message: data.message
        });
    }

    errorCallback(){
        this.setState({
            found: false
        });
    }

    render(){
        if(this.state.found){
            if(this.state.message == null){
                this.getMessage(this.props.match.params.id);
                return <div>Loading...</div>
            } else {
                return (
                    <div>
                        <Message message={this.state.message} id={parseInt(this.props.match.params.id, 10)}/>
                    </div> 
                )
            }
        } else {
            return <div>That post does not exist</div>
        }   
    }
}
