import React, { Component } from 'react';
import { routeService } from '../services/routeService';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FlipCameraIosIcon from '@material-ui/icons/FlipCameraIos';
import { Link } from 'react-router-dom';
import { MobileNavigationProps } from '../interfaces/navigation';
import { AuthenticationRoute } from '../constants/constants';
import { BarChart } from '@material-ui/icons';

class MobileNavigation extends Component<MobileNavigationProps> {
  render() {
    return (
      <BottomNavigation value={this.props.selectedValue} showLabels>
        <BottomNavigationAction
          className="Mui-selected"
          label={routeService.getSelectedRoute()}
          onClick={() => this.props.onClick()}
          icon={routeService.isGraphsPage() ? <BarChart /> : <FlipCameraIosIcon />}
        />
        <BottomNavigationAction
          label="Kirjaudu ulos"
          value={AuthenticationRoute.Logout}
          onClick={() => this.props.onToggle(AuthenticationRoute.Logout)}
          component={Link}
          to={AuthenticationRoute.Logout}
          icon={<AccountCircle />}
        />
      </BottomNavigation>
    );
  }
}

export default MobileNavigation;
