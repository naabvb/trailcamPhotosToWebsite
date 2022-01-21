import PrivateRoute from '../components/privateRoute';
import { Route, Switch, Redirect } from 'react-router-dom';
import Images from '../components/images';
import React, { PureComponent } from 'react';
import { LoginPage } from '../components/login';
import LogOut from '../components/logout';
import { AuthenticationRoute, jatkalaRoutes, LoadingState, Role, vastilaRoutes } from '../constants/constants';

export const routeService = {
  getJatkalaRoutes,
  getVastilaRoutes,
  isSelectedRoute,
  getSelectedRoute,
  getPrivateRoutes,
  getAllRoutes,
  getDefaultRoute,
  getSwitch,
  isLoginPage,
  isLogoutPage,
};

function getJatkalaRoutes() {
  return jatkalaRoutes;
}

function getVastilaRoutes() {
  return vastilaRoutes;
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
  return getAllRoutes().find((item) => isSelectedRoute(item.route))?.name;
}

function getPrivateRoutes(role: Role) {
  return getAllRoutes().map((routeObj) => {
    return (
      <PrivateRoute
        path={routeObj.route}
        component={Images as unknown as PureComponent}
        stage={routeObj.route}
        role={role}
        status={LoadingState.Loading}
      />
    );
  });
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
