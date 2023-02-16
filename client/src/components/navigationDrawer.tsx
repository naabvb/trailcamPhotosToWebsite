import React, { Component } from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import { routeService } from '../services/routeService';
import DrawerItem from './drawerItem';
import { Role } from '../constants/constants';
import { NavigationDrawerProps } from '../interfaces/navigation';

class NavigationDrawer extends Component<NavigationDrawerProps> {
  render() {
    return (
      <SwipeableDrawer
        disableDiscovery={true}
        disableSwipeToOpen={true}
        anchor="bottom"
        open={this.props.drawerOpen}
        onClose={() => this.props.onClose()}
        onOpen={() => this.props.onOpen()}
      >
        <DrawerItem
          type="camera"
          timestamps={this.props.timestamps}
          routeObjects={routeService.getJatkalaRoutes()}
          onClick={this.props.onClick}
        />
        {this.props.role === Role.Vastila ? (
          <>
            <Divider />
            <DrawerItem
              type="camera"
              timestamps={this.props.timestamps}
              routeObjects={routeService.getVastilaRoutes()}
              onClick={this.props.onClick}
            />
          </>
        ) : null}
        {this.props.role === Role.Vastila || this.props.role === Role.Jatkala ? (
          <>
            <Divider />
            <DrawerItem
              type="graphs"
              timestamps={this.props.timestamps}
              routeObjects={routeService.getGraphRoutes()}
              onClick={this.props.onClick}
            />
          </>
        ) : null}
      </SwipeableDrawer>
    );
  }
}

export default NavigationDrawer;
