import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import { Link, Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import ImagesG from "./Images";
import ImagesG2 from "./Images2";
import { PrivateRoute } from './_components/PrivateRoute';
import { LoginPage } from './login';
import { userService } from './_services/user.service'
import AppBar from '@material-ui/core/AppBar';

export default class CenteredTabs extends Component {
  constructor(props) {
    super(props)
    this.state = { tabValue: "/one", user: {} }
  }

  toggle(event) {
    this.setState({ tabValue: event })
  }

  componentDidMount() {
    if (performance.navigation.type === 1) {
      this.setState({ tabValue: window.location.pathname, user: JSON.parse(localStorage.getItem('user'))});
    }

    else {
      this.setState({ tabValue: window.location.pathname, user: JSON.parse(localStorage.getItem('user'))});
    }
  }

  componentDidUpdate() {
    window.onpopstate = (e) => {
      this.setState({ tabValue: window.location.pathname })
    }
  }

  render() {
    const tabValue = this.state.tabValue
    let items = [];
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      items.push(<Tab value={'/one'} onClick={(e) => this.toggle("/one")} label="Riistakamera 1" component={Link} to="/one" />);
      items.push(<Tab value={'/login'} onClick={(e) => this.toggle("/login")} label="Kirjaudu ulos" component={Link} to="/login" />);
      items.push(<Tab value={'/two'} onClick={(e) => this.toggle("/two")} label="Riistakamera 2" component={Link} to="/two" />);
    }

    let trueValue
    if (tabValue === '/' || tabValue === null) {
      trueValue = '/one'
    }
    else {
      trueValue = tabValue
    }

    const useStyles = makeStyles({
      root: {
        flexGrow: 1,
      },
    });
    console.log(user);
    return (
      <BrowserRouter>
        <Paper className={useStyles.root}>
          <Tabs
            value={trueValue}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            {items}
          </Tabs>
        </Paper>

        <Switch>
          <PrivateRoute exact path="/"><Redirect to="/one"></Redirect>
          </PrivateRoute>
          <PrivateRoute path="/one" component={ImagesG} />
          <PrivateRoute path="/two" component={ImagesG2} />
          <Route path="/login" component={LoginPage} />
        </Switch>
      </BrowserRouter>
    );
  }
}
