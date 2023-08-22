import { Route } from '../interfaces/data';
import { routeService } from '../services/routeService';

export enum Role {
  Vastila = 'vastila',
  Jatkala = 'jatkala',
  None = 'none',
}

export const jatkalaRoutes: Route[] = [
  { name: 'Jätkälä 1', route: '/j1', selected: () => routeService.isSelectedRoute('/j1') },
  { name: 'Jätkälä 2', route: '/j2', selected: () => routeService.isSelectedRoute('/j2') },
  { name: 'Jätkälä 3', route: '/j3', selected: () => routeService.isSelectedRoute('/j3') },
  { name: 'Jätkälä 4', route: '/j4', selected: () => routeService.isSelectedRoute('/j4') },
];

export const vastilaRoutes: Route[] = [
  { name: 'Västilä 1', route: '/v1', selected: () => routeService.isSelectedRoute('/v1') },
  { name: 'Västilä 2', route: '/v2', selected: () => routeService.isSelectedRoute('/v2') },
  { name: 'Västilä 3', route: '/v3', selected: () => routeService.isSelectedRoute('/v3') },
  { name: 'Västilä 4', route: '/v4', selected: () => routeService.isSelectedRoute('/v4') },
];

export const graphRoutes: Route[] = [
  { name: 'Tilastot', route: '/graphs', selected: () => routeService.isSelectedRoute('/graphs') },
];

export enum AuthenticationRoute {
  Login = '/login',
  Logout = '/logout',
}

export enum LoadingState {
  Loading = 'loading',
  Loaded = 'loaded',
}
