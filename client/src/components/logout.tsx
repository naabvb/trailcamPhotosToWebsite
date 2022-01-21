import React, { Component } from 'react';
import '../app.css';
import * as serviceWorker from '../serviceWorker';
import { Typography } from '@material-ui/core';
import { AuthenticationRoute } from '../constants/constants';
import { logout } from '../services/apiService';

class LogOut extends Component {
  async componentDidMount() {
    await logout();
    serviceWorker.unregister();
    window.location.pathname = AuthenticationRoute.Login;
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
