import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import { userService } from '../services/userService';
import { AuthenticationRoute } from '../constants/constants';
import { PrivateRouteProps, PrivateRouteState } from '../interfaces/privateRoute';

class PrivateRoute extends Component<PrivateRouteProps, PrivateRouteState> {
  constructor(props: PrivateRouteProps) {
    super(props);
    this.state = {
      loading: true,
      isAuthenticated: false,
    };
  }

  async componentDidMount() {
    const role = await userService.getRole();
    this.setState({ loading: false, isAuthenticated: userService.hasRole(role) });
  }

  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(props) =>
          this.state.isAuthenticated ? (
            <Component {...props} stage={this.props.stage} status={this.props.status} role={this.props.role} />
          ) : this.state.loading ? (
            <Paper></Paper>
          ) : (
            <Redirect to={{ pathname: AuthenticationRoute.Login, state: { from: this.props.location } }} />
          )
        }
      />
    );
  }
}

export default PrivateRoute;
