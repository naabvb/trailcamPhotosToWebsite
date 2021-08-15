import React, { Component } from 'react';
import { routeService } from '../services/routeService';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import { Link } from 'react-router-dom';

class MobileNavigation extends Component {
  render() {
    return (
      <BottomNavigation value={this.props.selectedValue} showLabels>
        <BottomNavigationAction
          className="Mui-selected"
          label={routeService.getSelectedRoute()}
          onClick={() => this.props.onClick()}
          icon={<FlipCameraIosIcon />}
        />
        <BottomNavigationAction
          label="Kirjaudu ulos"
          value={'/logout'}
          onClick={() => this.props.onToggle('/logout')}
          component={Link}
          to="/logout"
          icon={<AccountCircle />}
        />
      </BottomNavigation>
    );
  }
}

export default MobileNavigation;
