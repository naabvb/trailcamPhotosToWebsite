import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class LogOut extends Component {
    async componentDidMount() {
        await axios.get('/api/clear-role')
    }

    render() {
        const isMobile = window.innerWidth < 1025;
        const heights = isMobile ? 170 : 280;
        const backdrop = isMobile ? false : true;
        window.location.pathname = "/login"
        return (
            <div>
                <h2>Logged out</h2>
            </div>
        );
    }
}

export default LogOut;
