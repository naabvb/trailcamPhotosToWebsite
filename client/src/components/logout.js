import React, { Component } from 'react';
import '../App.css';
import axios from 'axios';
import * as serviceWorker from '../serviceWorker';
import { Typography } from '@material-ui/core';

class LogOut extends Component {
  async componentDidMount() {
    await axios.get('/api/clear-role');
    const useragent = window.navigator.userAgent;
    if (useragent.indexOf('Edge') === -1) {
      // If not MS Edge
      window.location.reload(true);
    }
    serviceWorker.unregister();
    window.location.pathname = '/login';
  }

  render() {
    return (
      <Typography className="text-center logOutText" align="center" variant="h5">
        Kirjaudutaan ulos
      </Typography>
    );
  }
}

export default LogOut;
