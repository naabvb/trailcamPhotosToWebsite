import { LoadingState, Role } from '../constants/constants';

export interface PrivateRouteProps {
  exact?: boolean;
  path: string;
  location?: undefined;
  component?: any;
  stage?: string;
  role?: Role;
  status?: LoadingState;
}

export interface PrivateRouteState {
  loading: boolean;
  isAuthenticated: boolean;
}
