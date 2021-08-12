import PrivateRoute from '../components/privateRoute';
import Images from '../components/images';
import React from 'react';

export const routeService = {
  getJatkalaRoutes,
  getVastilaRoutes,
  isSelectedRoute,
  getSelectedRoute,
  getPrivateRoutes,
  getAllRoutes,
  getDefaultRoute,
};

function getJatkalaRoutes() {
  return [
    { name: 'Jätkälä 1', route: '/j1', selected: isSelectedRoute('/j1') },
    { name: 'Jätkälä 2', route: '/j2', selected: isSelectedRoute('/j2') },
    { name: 'Jätkälä 3', route: '/j3', selected: isSelectedRoute('/j3') },
    { name: 'Jätkälä 4', route: '/j4', selected: isSelectedRoute('/j4') },
  ];
}

function getVastilaRoutes() {
  return [
    { name: 'Västilä 1', route: '/v1', selected: isSelectedRoute('/v1') },
    { name: 'Västilä 2', route: '/v2', selected: isSelectedRoute('/v2') },
  ];
}

function getAllRoutes() {
  return [...getJatkalaRoutes(), ...getVastilaRoutes()];
}

function getDefaultRoute() {
  return getJatkalaRoutes()[0].route;
}

function isSelectedRoute(route) {
  return window.location.pathname === route;
}

function getSelectedRoute() {
  return getAllRoutes().find((item) => isSelectedRoute(item.route))?.name;
}

function getPrivateRoutes(role) {
  return getAllRoutes().map((routeObj) => {
    return (
      <PrivateRoute path={routeObj.route} component={Images} stage={routeObj.route} role={role} status={'loading'} />
    );
  });
}
