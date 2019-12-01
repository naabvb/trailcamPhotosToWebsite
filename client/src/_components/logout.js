import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';

class LogOut extends Component {
    async componentDidMount() {
        await axios.get('/api/clear-role')
        window.location.reload(true);
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
