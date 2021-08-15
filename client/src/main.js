import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Link, BrowserRouter, Redirect } from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LinkedCamera from '@material-ui/icons/LinkedCamera';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import { getRole } from './services/userService';
import NavigationDrawer from './components/navigationDrawer';
import { routeService } from './services/routeService';
import { stylesService } from './services/stylesService';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { tabValue: routeService.getDefaultRoute(), role: {}, drawerOpen: false };
  }

  toggle(event) {
    this.setState({ tabValue: event, drawerOpen: false });
  }

  async componentDidMount() {
    const response = await getRole();
    this.setState({ tabValue: window.location.pathname, role: response });
    stylesService.scrollTop();
  }

  async componentDidUpdate() {
    window.onpopstate = async () => {
      const response = await getRole();
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
      stylesService.setGalleryHeight();
    }
    let items = [];
    const role = this.state.role;

    if (!role) {
      items.push(<Redirect to={{ pathname: '/login' }} key="redirect"></Redirect>);
    }

    const selectedValue =
      this.state.tabValue && this.state.tabValue !== '/' ? this.state.tabValue : routeService.getDefaultRoute();

    if (role === 'jatkala') {
      if (!stylesService.isMobile()) {
        items.push(
          <Tabs key="jdm" value={selectedValue} indicatorColor="primary" textColor="primary" variant="fullWidth">
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
              onClick={() => this.toggle('/logout')}
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

      if (stylesService.isMobile()) {
        items.push(
          <BottomNavigation key="jvm" value={selectedValue} showLabels>
            <BottomNavigationAction
              className="Mui-selected"
              label={routeService.getSelectedRoute()}
              onClick={() => this.openDrawer()}
              icon={<FlipCameraIosIcon />}
            />
            <BottomNavigationAction
              label="Kirjaudu ulos"
              value={'/logout'}
              onClick={() => this.toggle('/logout')}
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
      if (!stylesService.isMobile()) {
        items.push(
          <Tabs key="vdm" value={selectedValue} indicatorColor="primary" textColor="primary" variant="fullWidth">
            {routeService.getAllRoutes().map((item, index) => (
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
              onClick={() => this.toggle('/logout')}
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

      if (stylesService.isMobile()) {
        items.push(
          <BottomNavigation key="vvm" value={selectedValue} showLabels>
            <BottomNavigationAction
              className="Mui-selected"
              label={routeService.getSelectedRoute()}
              onClick={() => this.openDrawer()}
              icon={<FlipCameraIosIcon />}
            />
            <BottomNavigationAction
              label="Kirjaudu ulos"
              value={'/logout'}
              onClick={() => this.toggle('/logout')}
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
          <NavigationDrawer
            drawerOpen={this.state.drawerOpen}
            onClose={() => this.closeDrawer()}
            onOpen={() => this.openDrawer()}
            onClick={() => this.toggle()}
            role={role}
          />
        </Paper>
        {routeService.getSwitch(role)}
      </BrowserRouter>
    );
  }
}
