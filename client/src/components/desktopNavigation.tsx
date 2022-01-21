import React, { Component } from 'react';
import LinkedCamera from '@material-ui/icons/LinkedCamera';
import { Link } from 'react-router-dom';
import { routeService } from '../services/routeService';
import { localStorageService } from '../services/localStorageService';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Badge from '@material-ui/core/Badge';
import { AuthenticationRoute, Role } from '../constants/constants';
import { DesktopNavigationProps } from '../interfaces/navigation';

class DesktopNavigation extends Component<DesktopNavigationProps> {
  render() {
    const routes = this.props.role === Role.Vastila ? routeService.getAllRoutes() : routeService.getJatkalaRoutes();
    return (
      <Tabs value={this.props.selectedValue} indicatorColor="primary" textColor="primary" variant="fullWidth">
        {routes.map((item, index) => (
          <Tab
            value={item.route}
            onClick={() => this.props.onClick(item.route)}
            label={
              <>
                <Badge
                  color="secondary"
                  variant="dot"
                  invisible={!localStorageService.hasNewImages(item.route, this.props.timestamps)}
                >
                  <LinkedCamera fontSize="inherit" />
                </Badge>
                {item.name}
              </>
            }
            component={Link}
            to={item.route}
            key={index}
          />
        ))}
        <Tab
          value={AuthenticationRoute.Logout}
          onClick={() => this.props.onClick(AuthenticationRoute.Logout)}
          label={
            <>
              <AccountCircle fontSize="inherit" /> Kirjaudu ulos
            </>
          }
          component={Link}
          to={AuthenticationRoute.Logout}
        />
      </Tabs>
    );
  }
}

export default DesktopNavigation;
