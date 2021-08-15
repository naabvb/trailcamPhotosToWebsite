import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { BrowserRouter, Redirect } from 'react-router-dom';
import { getRole, userService } from './services/userService';
import NavigationDrawer from './components/navigationDrawer';
import { routeService } from './services/routeService';
import { stylesService } from './services/stylesService';
import DesktopNavigation from './components/desktopNavigation';
import MobileNavigation from './components/mobileNavigation';

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { tabValue: routeService.getDefaultRoute(), role: {}, drawerOpen: false };
  }

  toggle(newValue) {
    this.setState({ tabValue: newValue, drawerOpen: false });
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
    if (!routeService.isLoginPage()) {
      stylesService.setGalleryHeight();
    }
    const role = this.state.role;
    const selectedValue =
      this.state.tabValue && this.state.tabValue !== '/' ? this.state.tabValue : routeService.getDefaultRoute();

    const useStyles = makeStyles({
      root: {
        flexGrow: 1,
      },
    });
    return (
      <BrowserRouter>
        <Paper className={useStyles.root}>
          {!role ? <Redirect to={{ pathname: '/login' }} key="redirect"></Redirect> : null}
          {stylesService.isMobile() && userService.hasRole(role) ? (
            <React.Fragment>
              <MobileNavigation
                selectedValue={selectedValue}
                onClick={() => this.openDrawer()}
                onToggle={(newValue) => this.toggle(newValue)}
              />
              <NavigationDrawer
                drawerOpen={this.state.drawerOpen}
                onClose={() => this.closeDrawer()}
                onOpen={() => this.openDrawer()}
                onClick={(newValue) => this.toggle(newValue)}
                role={role}
              />{' '}
            </React.Fragment>
          ) : null}
          {!stylesService.isMobile() && userService.hasRole(role) ? (
            <DesktopNavigation
              role={role}
              selectedValue={selectedValue}
              onClick={(newValue) => this.toggle(newValue)}
            />
          ) : null}
        </Paper>
        {routeService.getSwitch(role)}
      </BrowserRouter>
    );
  }
}
