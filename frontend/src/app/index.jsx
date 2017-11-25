import React from 'react';
import ReactDOM from 'react-dom';

import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import { Home } from "./routes/Home/Home.jsx";
import { Post } from "./routes/Post/Post.jsx";

import './index.scss';


ReactDOM.render(
    <Router>
        <div>
        <Route exact path="/" component={Home}/>
        <Route exact path="/post/:id" component={Post}/>
        </div>
    </Router>
    , document.getElementById('root'));
