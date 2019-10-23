import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import { Link, Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import ImagesG from "./Images";
import ImagesG2 from "./Images2";
import PrivateRoute from './_components/PrivateRoute';
import { LoginPage } from './login';
import { userService } from './_services/user.service'
import AppBar from '@material-ui/core/AppBar';
import { getRole } from './_services/user.service';

export default class CenteredTabs extends Component {
  constructor(props) {
    super(props)
    this.state = { tabValue: "/one", role: {} }
  }

  toggle(event) {
    this.setState({ tabValue: event })
  }

  async componentDidMount() {
    console.log("mount")
    const response = await getRole();

    if (performance.navigation.type === 1) {
      this.setState({ tabValue: window.location.pathname, role: response});
    }

    else {
      this.setState({ tabValue: window.location.pathname, role: response});
    }
  }

  async componentDidUpdate() {
    console.log("update")
    console.log(window)
    const response = await getRole();
    if (response != this.state.role) {
      this.setState({role:response})
    }
    window.onpopstate = (e) => {
      this.setState({ tabValue: window.location.pathname, role: response })
    }
  }

  redirectToTarget = () => {
    window.location.pathname = '/login';
  }

  render() {
    const tabValue = this.state.tabValue
    let items = [];
   let role = this.state.role;
   console.log(role)
   let user = true;
  // console.log(user)
    if (role) {
      items.push(<Tab value={'/one'} onClick={(e) => this.toggle("/one")} label="Riistakamera 1" component={Link} to="/one" />);
      items.push(<Tab value={'/login'} onClick={(e) => this.toggle("/login")} label="Kirjaudu ulos" component={Link} to="/login" />);
      items.push(<Tab value={'/two'} onClick={(e) => this.toggle("/two")} label="Riistakamera 2" component={Link} to="/two" />);
    }
    if (role === false) {
      items.push(<Redirect to={{ pathname: '/login'}}></Redirect>)
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
