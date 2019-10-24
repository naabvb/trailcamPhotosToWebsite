import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Link, Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import ImagesG from "./Images";
import ImagesG2 from "./Images2";
import AccountCircle from '@material-ui/icons/AccountCircle';
import LinkedCamera from '@material-ui/icons/LinkedCamera';
import PrivateRoute from './_components/PrivateRoute';
import { LoginPage } from './login';
import LogOut from "./logout";
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
      this.setState({ tabValue: window.location.pathname, role: response });
    }

    else {
      this.setState({ tabValue: window.location.pathname, role: response });
    }
    window.scrollTo(0, 0);

  }

  async componentDidUpdate() {
    console.log("update")
    console.log(window)
    const response = await getRole();
    if (response !== this.state.role) {
      this.setState({ role: response })
    }
    window.onpopstate = (e) => {
      this.setState({ tabValue: window.location.pathname, role: response })
    }
    window.scrollTo(0, 0);
    // document.getElementById("footer_block").style.display = "block";
    //document.getElementById("root").style.minHeight = 0;
  }

  redirectToTarget = () => {
    window.location.pathname = '/login';
  }

  render() {
    if (window.location.pathname !== "/login") {
      document.getElementById("footer_block").style.display = "block";
      document.getElementById("footer_block").style.position = "static";
      document.getElementById("root").style.minHeight = "2000px";
    }
    const isMobile = window.innerWidth < 1025;
    const tabValue = this.state.tabValue
    let items = [];
    let role = this.state.role;
    console.log(role)
    let user = true;
    // console.log(user)
    //if (role === true) {
    //  items.push(<Tab value={'/one'} onClick={(e) => this.toggle("/one")} label="Riistakamera 1" component={Link} to="/one" />);
    //  items.push(<Tab value={'/two'} onClick={(e) => this.toggle("/two")} label="Riistakamera 2" component={Link} to="/two" />);
    //  items.push(<Tab value={'/logout'} onClick={(e) => this.toggle("/logout")} label={<><AccountCircle fontSize="inherit" /> Kirjaudu ulos</>} component={Link} to="/logout" />);
    //}


    if (role === false) {
      items.push(<Redirect to={{ pathname: '/login' }}></Redirect>)
    }

    let trueValue
    if (tabValue === '/' || tabValue === null) {
      trueValue = '/one'
    }
    else {
      trueValue = tabValue
    }

    if (role === true) {

      if (isMobile === false) {
        items.push(<Tabs
          value={trueValue}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab value={'/one'} onClick={(e) => this.toggle("/one")} label={<><LinkedCamera fontSize="inherit" /> Jätkälä 1</>} component={Link} to="/one" />);
        <Tab value={'/two'} onClick={(e) => this.toggle("/two")} label={<><LinkedCamera fontSize="inherit" /> Jätkälä 2</>} component={Link} to="/two" />
          <Tab value={'/logout'} onClick={(e) => this.toggle("/logout")} label={<><AccountCircle fontSize="inherit" /> Kirjaudu ulos</>} component={Link} to="/logout" />
        </Tabs>)
      }

      if (isMobile === true) {
        items.push(<BottomNavigation value={trueValue} indicatorColor="primary" textColor="primary" showLabels>
          <BottomNavigationAction label="Jätkälä 1" value={'/one'} onClick={(e) => this.toggle("/one")} component={Link} to="/one" icon={<LinkedCamera />} />
          <BottomNavigationAction label="Jätkälä 2" value={'/two'} onClick={(e) => this.toggle("/two")} component={Link} to="/two" icon={<LinkedCamera />} />
          <BottomNavigationAction label="Kirjaudu ulos" value={'/logout'} onClick={(e) => this.toggle("/logout")} component={Link} to="/logout" icon={<AccountCircle />} />
        </BottomNavigation>);
        document.getElementById('footer_block').style.marginBottom = "4em";
      }
    }

    const useStyles = makeStyles({
      root: {
        flexGrow: 1,
      },
    });
    return (
      <BrowserRouter>
        <Paper className={useStyles.root}>
          {items}
        </Paper>

        <Switch>
          <PrivateRoute exact path="/"><Redirect to="/one"></Redirect>
          </PrivateRoute>
          <PrivateRoute path="/one" component={ImagesG} />
          <PrivateRoute path="/two" component={ImagesG2} />
          <Route path="/login" component={LoginPage} />
          <Route path="/logout" component={LogOut} />
        </Switch>
      </BrowserRouter>
    );
  }
}
