import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { BrowserRouter } from 'react-router-dom';
import { getRole, userService } from './services/userService';
import NavigationDrawer from './components/navigationDrawer';
import { routeService } from './services/routeService';
import { stylesService } from './services/stylesService';
import DesktopNavigation from './components/desktopNavigation';
import MobileNavigation from './components/mobileNavigation';
import { localStorageService } from './services/localStorageService';
import { DefaultProps, MainState } from './interfaces/components';

export default class Main extends Component<DefaultProps, MainState> {
  constructor(props: DefaultProps) {
    super(props);
    this.state = { tabValue: routeService.getDefaultRoute(), role: '', drawerOpen: false, timestamps: [] };
  }

  async toggle(newValue: string) {
    this.setState({ tabValue: newValue, drawerOpen: false });
    if (!stylesService.isMobile() && newValue !== '/logout') {
      await this.updateTimestamps();
    }
  }

  async componentDidMount() {
    const response = await getRole();
    this.setState({ tabValue: window.location.pathname, role: response });
    stylesService.scrollTop();
    if (!stylesService.isMobile()) {
      await this.updateTimestamps();
    }
  }

  async componentDidUpdate() {
    localStorageService.updatelocalStorage();
    window.onpopstate = async () => {
      const response = await getRole();
      this.setState({ tabValue: window.location.pathname, role: response });
    };
  }

  async updateTimestamps() {
    const timestamps = await localStorageService.getTimestamps().catch(() => (window.location.pathname = '/login'));
    this.setState({ timestamps: timestamps });
  }

  async openDrawer() {
    this.setState({ drawerOpen: true });
    await this.updateTimestamps();
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
    return (
      <BrowserRouter>
        <Paper>
          {stylesService.isMobile() && userService.hasRole(role) ? (
            <React.Fragment>
              <MobileNavigation
                selectedValue={selectedValue}
                onClick={() => this.openDrawer()}
                onToggle={(newValue: string) => this.toggle(newValue)}
              />
              <NavigationDrawer
                timestamps={this.state.timestamps}
                drawerOpen={this.state.drawerOpen}
                onClose={() => this.closeDrawer()}
                onOpen={() => this.openDrawer()}
                onClick={(newValue: string) => this.toggle(newValue)}
                role={role}
              />{' '}
            </React.Fragment>
          ) : null}
          {!stylesService.isMobile() && userService.hasRole(role) ? (
            <DesktopNavigation
              timestamps={this.state.timestamps}
              role={role}
              selectedValue={selectedValue}
              onClick={(newValue: string) => this.toggle(newValue)}
            />
          ) : null}
        </Paper>
        {routeService.getSwitch(role)}
      </BrowserRouter>
    );
  }
}
