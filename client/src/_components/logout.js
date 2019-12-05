import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import * as serviceWorker from '../serviceWorker';

class LogOut extends Component {
    async componentDidMount() {
        await axios.get('/api/clear-role')
        var useragent = window.navigator.userAgent
        if (useragent.indexOf("Edge") === -1) { // If not MS Edge
            window.location.reload(true);
        }
        serviceWorker.unregister();
        window.location.pathname = "/login"
    }

    render() {
        return (
            <div>
                <h2 id="log_out">Logged out</h2>
            </div>
        );
    }
}

export default LogOut;
