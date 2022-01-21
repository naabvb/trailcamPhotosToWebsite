import { Dialog } from 'muibox';
import { LoadingState } from '../constants/constants';
import { ImageSet } from './data';

export interface ImagesState {
  images: ImageSet[];
  status: LoadingState;
  prev: string;
  showEmpty: boolean;
}

export interface ImagesProps {
  stage: string;
  status: LoadingState;
  role: string;
  history: {
    action: string;
  };
  dialog: Dialog;
}
