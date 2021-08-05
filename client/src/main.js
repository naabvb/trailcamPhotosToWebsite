import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Link, Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import Images from './components/images';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LinkedCamera from '@material-ui/icons/LinkedCamera';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import PrivateRoute from './components/privateRoute';
import { LoginPage } from './components/login';
import LogOut from './components/logout';
import { getRole } from './services/userService';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { routeService } from './services/routeService';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { tabValue: routeService.getJatkalaRoutes()[0].route, role: {}, drawerOpen: false };
  }

  toggle(event) {
    this.setState({ tabValue: event, drawerOpen: false });
  }

  async componentDidMount() {
    const response = await getRole();

    if (performance.navigation.type === 1) {
      this.setState({ tabValue: window.location.pathname, role: response });
    } else {
      this.setState({ tabValue: window.location.pathname, role: response });
    }
    let body = document.getElementsByTagName('body')[0];
    body.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  async componentDidUpdate() {
    const response = await getRole();
    if (response !== this.state.role) {
      this.setState({ role: response });
    }
    window.onpopstate = (e) => {
      this.setState({ tabValue: window.location.pathname, role: response });
    };
  }

  openDrawer() {
    this.setState({ drawerOpen: true });
  }

  closeDrawer() {
    this.setState({ drawerOpen: false });
  }

  render() {
    if (window.location.pathname !== '/login') {
      document.getElementById('footer_block').style.display = 'block';
      document.getElementById('footer_block').style.position = 'static';
      document.getElementById('root').style.minHeight = '2000px';
    }
    const isMobile = window.innerWidth < 1025;
    const tabValue = this.state.tabValue;
    let items = [];
    const role = this.state.role;

    if (!role) {
      items.push(<Redirect to={{ pathname: '/login' }} key="redirect"></Redirect>);
    }

    let trueValue;
    if (tabValue === '/' || tabValue === null) {
      trueValue = routeService.getJatkalaRoutes()[0].route;
    } else {
      trueValue = tabValue;
    }

    if (role === 'jatkala') {
      if (!isMobile) {
        items.push(
          <Tabs value={trueValue} indicatorColor="primary" textColor="primary" variant="fullWidth">
            {routeService.getJatkalaRoutes().map((item, index) => (
              <Tab
                value={item.route}
                onClick={() => this.toggle(item.route)}
                label={
                  <>
                    <LinkedCamera fontSize="inherit" />
                    {item.name}
                  </>
                }
                component={Link}
                to={item.route}
                key={index}
              />
            ))}
            <Tab
              value={'/logout'}
              onClick={(e) => this.toggle('/logout')}
              label={
                <>
                  <AccountCircle fontSize="inherit" /> Kirjaudu ulos
                </>
              }
              component={Link}
              to="/logout"
            />
          </Tabs>
        );
      }

      if (isMobile) {
        items.push(
          <BottomNavigation value={trueValue} showLabels>
            {routeService.getJatkalaRoutes().map((item, index) => (
              <BottomNavigationAction
                label={item.name}
                value={item.route}
                onClick={() => this.toggle(item.route)}
                component={Link}
                to={item.route}
                icon={<LinkedCamera />}
                key={index}
              />
            ))}
            <BottomNavigationAction
              label="Kirjaudu ulos"
              value={'/logout'}
              onClick={(e) => this.toggle('/logout')}
              component={Link}
              to="/logout"
              icon={<AccountCircle />}
            />
          </BottomNavigation>
        );
        document.getElementById('footer_block').style.marginBottom = '4.1em';
      }
    }

    if (role === 'vastila') {
      if (!isMobile) {
        items.push(
          <Tabs value={trueValue} indicatorColor="primary" textColor="primary" variant="fullWidth">
            {[...routeService.getJatkalaRoutes(), ...routeService.getVastilaRoutes()].map((item, index) => (
              <Tab
                value={item.route}
                onClick={() => this.toggle(item.route)}
                label={
                  <>
                    <LinkedCamera fontSize="inherit" />
                    {item.name}
                  </>
                }
                component={Link}
                to={item.route}
                key={index}
              />
            ))}
            <Tab
              value={'/logout'}
              onClick={(e) => this.toggle('/logout')}
              label={
                <>
                  <AccountCircle fontSize="inherit" /> Kirjaudu ulos
                </>
              }
              component={Link}
              to="/logout"
            />
          </Tabs>
        );
      }

      if (isMobile) {
        items.push(
          <BottomNavigation value={trueValue} showLabels>
            <BottomNavigationAction
              className="Mui-selected"
              label={routeService.getSelectedRoute()}
              onClick={() => this.openDrawer()}
              icon={<FlipCameraIosIcon />}
            />
            <BottomNavigationAction
              label="Kirjaudu ulos"
              value={'/logout'}
              onClick={(e) => this.toggle('/logout')}
              component={Link}
              to="/logout"
              icon={<AccountCircle />}
            />
          </BottomNavigation>
        );
        document.getElementById('footer_block').style.marginBottom = '4.1em';
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
          <SwipeableDrawer
            anchor="bottom"
            open={this.state.drawerOpen}
            onClose={() => this.closeDrawer()}
            onOpen={() => this.openDrawer()}
          >
            <List>
              {routeService.getJatkalaRoutes().map((item, index) => (
                <ListItem
                  selected={item.selected}
                  button
                  component={Link}
                  to={item.route}
                  onClick={() => this.toggle(item.route)}
                  key={index}
                >
                  <ListItemIcon>
                    <LinkedCamera className={item.selected ? 'selectedIcon' : 'drawerIcon'} />
                  </ListItemIcon>
                  <ListItemText className={item.selected ? 'selectedDrawerText' : 'drawerText'} primary={item.name} />
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {routeService.getVastilaRoutes().map((item, index) => (
                <ListItem
                  selected={item.selected}
                  button
                  component={Link}
                  to={item.route}
                  onClick={() => this.toggle(item.route)}
                  key={index}
                >
                  <ListItemIcon>
                    <LinkedCamera className={item.selected ? 'selectedIcon' : 'drawerIcon'} />
                  </ListItemIcon>
                  <ListItemText className={item.selected ? 'selectedDrawerText' : 'drawerText'} primary={item.name} />
                </ListItem>
              ))}
            </List>
          </SwipeableDrawer>
        </Paper>

        <Switch>
          <PrivateRoute exact path="/">
            <Redirect to={routeService.getJatkalaRoutes()[0].route}></Redirect>
          </PrivateRoute>
          <PrivateRoute path="/one" component={Images} stage={'1'} status={'loading'} role={this.state.role} />
          <PrivateRoute path="/two" component={Images} stage={'2'} status={'loading'} role={this.state.role} />
          <PrivateRoute path="/three" component={Images} stage={'3'} status={'loading'} role={this.state.role} />
          <PrivateRoute path="/four" component={Images} stage={'4'} status={'loading'} role={this.state.role} />
          <Route path="/login" component={LoginPage} />
          <Route path="/logout" component={LogOut} />
        </Switch>
      </BrowserRouter>
    );
  }
}
