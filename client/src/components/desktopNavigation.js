import React, { Component } from 'react';
import LinkedCamera from '@material-ui/icons/LinkedCamera';
import { Link } from 'react-router-dom';
import { routeService } from '../services/routeService';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AccountCircle from '@material-ui/icons/AccountCircle';

class DesktopNavigation extends Component {
  render() {
    const routes = this.props.role === 'vastila' ? routeService.getAllRoutes() : routeService.getJatkalaRoutes();
    return (
      <Tabs value={this.props.selectedValue} indicatorColor="primary" textColor="primary" variant="fullWidth">
        {routes.map((item, index) => (
          <Tab
            value={item.route}
            onClick={() => this.props.onClick(item.route)}
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
          onClick={() => this.props.onClick('/logout')}
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
}

export default DesktopNavigation;
