import React, { Component } from 'react';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import { routeService } from '../services/routeService';
import DrawerItem from './drawerItem';

class NavigationDrawer extends Component {
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
          timestamps={this.props.timestamps}
          routeObjects={routeService.getJatkalaRoutes()}
          onClick={() => this.props.onClick()}
        />
        {this.props.role === 'vastila' ? (
          <React.Fragment>
            <Divider />
            <DrawerItem
              timestamps={this.props.timestamps}
              routeObjects={routeService.getVastilaRoutes()}
              onClick={() => this.props.onClick()}
            />
          </React.Fragment>
        ) : null}
      </SwipeableDrawer>
    );
  }
}

export default NavigationDrawer;
