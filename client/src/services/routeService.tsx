import PrivateRoute from '../components/privateRoute';
import { Route, Switch, Redirect } from 'react-router-dom';
import Images from '../components/images';
import React, { PureComponent } from 'react';
import { LoginPage } from '../components/login';
import LogOut from '../components/logout';
import {
  AuthenticationRoute,
  graphRoutes,
  jatkalaRoutes,
  LoadingState,
  Role,
  vastilaRoutes,
} from '../constants/constants';
import Graphs from '../components/graphs';

export const routeService = {
  getJatkalaRoutes,
  getVastilaRoutes,
  getGraphRoutes,
  isSelectedRoute,
  getSelectedRoute,
  getPrivateRoutes,
  getAllRoutes,
  getDefaultRoute,
  getSwitch,
  isLoginPage,
  isLogoutPage,
  isGraphsPage,
};

function getJatkalaRoutes() {
  return jatkalaRoutes;
}

function getVastilaRoutes() {
  return vastilaRoutes;
}

function getGraphRoutes() {
  return graphRoutes;
}

function getAllRoutes() {
  return [...getJatkalaRoutes(), ...getVastilaRoutes()];
}

function getDefaultRoute() {
  return getJatkalaRoutes()[0].route;
}

function isSelectedRoute(route: string) {
  return window.location.pathname === route;
}

function getSelectedRoute() {
  return [...getAllRoutes(), ...getGraphRoutes()].find((item) => isSelectedRoute(item.route))?.name;
}

function getPrivateRoutes(role: Role) {
  const [graphRoute] = getGraphRoutes();
  return [
    ...getAllRoutes().map((routeObj) => {
      return (
        <PrivateRoute
          path={routeObj.route}
          component={Images as unknown as PureComponent}
          stage={routeObj.route}
          role={role}
          status={LoadingState.Loading}
        />
      );
    }),
    <PrivateRoute
      path={graphRoute.route}
      component={Graphs}
      stage={graphRoute.route}
      role={role}
      status={LoadingState.Loading}
    />,
  ];
}

function getSwitch(role: Role) {
  return (
    <Switch>
      <PrivateRoute exact path="/">
        <Redirect to={getDefaultRoute()}></Redirect>
      </PrivateRoute>
      {getPrivateRoutes(role)}
      <Route path={AuthenticationRoute.Login} component={LoginPage} />
      <Route path={AuthenticationRoute.Logout} component={LogOut} />
    </Switch>
  );
}

function isLoginPage() {
  return window.location.pathname === AuthenticationRoute.Login;
}

function isLogoutPage() {
  return window.location.pathname === AuthenticationRoute.Logout;
}

function isGraphsPage() {
  return window.location.pathname === '/graphs';
}
