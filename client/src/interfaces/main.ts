import { Role } from '../constants/constants';
import { Timestamp } from './data';

export interface MainState {
  tabValue: string;
  role: Role;
  drawerOpen: boolean;
  timestamps: Timestamp[];
}

export interface DefaultProps {}
