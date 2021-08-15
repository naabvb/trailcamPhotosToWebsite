import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LinkedCamera from '@material-ui/icons/LinkedCamera';
import { Link } from 'react-router-dom';

class DrawerItem extends Component {
  render() {
    return (
      <List>
        {this.props.routeObjects.map((item, index) => (
          <ListItem
            selected={item.selected}
            button
            component={Link}
            to={item.route}
            onClick={() => this.props.onClick(item.route)}
            key={index}
          >
            <ListItemIcon>
              <LinkedCamera className={item.selected ? 'selectedIcon' : 'drawerIcon'} />
            </ListItemIcon>
            <ListItemText className={item.selected ? 'selectedDrawerText' : 'drawerText'} primary={item.name} />
          </ListItem>
        ))}
      </List>
    );
  }
}

export default DrawerItem;
