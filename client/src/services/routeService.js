export const routeService = {
  getJatkalaRoutes,
  getVastilaRoutes,
  isSelectedRoute,
  getSelectedRoute,
};

function getJatkalaRoutes() {
  return [
    { name: 'Jätkälä 1', route: '/one', selected: isSelectedRoute('/one') },
    { name: 'Jätkälä 2', route: '/two', selected: isSelectedRoute('/two') },
  ];
}

function getVastilaRoutes() {
  return [
    { name: 'Västilä 1', route: '/three', selected: isSelectedRoute('/three') },
    { name: 'Västilä 2', route: '/four', selected: isSelectedRoute('/four') },
  ];
}

function isSelectedRoute(route) {
  if (window.location.pathname === route) return true;
  return false;
}

function getSelectedRoute() {
  const items = [...getVastilaRoutes(), ...getJatkalaRoutes()];
  return items.find((item) => isSelectedRoute(item.route))?.name;
}
