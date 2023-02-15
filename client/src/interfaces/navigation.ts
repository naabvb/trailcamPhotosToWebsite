import { Role } from '../constants/constants';
import { Route, Timestamp } from './data';

export interface DesktopNavigationProps {
  timestamps: Timestamp[];
  role: Role;
  selectedValue: string;
  onClick: (arg0: string) => Promise<void>;
}

export interface MobileNavigationProps {
  selectedValue: string;
  onClick: () => Promise<void>;
  onToggle: (arg0: string) => Promise<void>;
}

export interface NavigationDrawerProps {
  timestamps: Timestamp[];
  drawerOpen: boolean;
  onClose: () => void;
  onOpen: () => Promise<void>;
  onClick: (arg0: string) => Promise<void>;
  role: Role;
}

export interface DrawerItemProps {
  timestamps: Timestamp[];
  type: 'camera' | 'graphs';
  routeObjects: Route[];
  onClick: (arg0: string) => Promise<void>;
}
