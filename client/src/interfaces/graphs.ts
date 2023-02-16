import { LoadingState } from '../constants/constants';

export interface GraphsState {
  graphsData: GraphsData | null;
  loading: LoadingState;
}

export interface GraphsData {
  j1: CameraGraphs;
  j2: CameraGraphs;
  j3: CameraGraphs;
  j4: CameraGraphs;
}

export interface CameraGraphs {
  thisYear: CameraDataForYear;
  lastYear: CameraDataForYear;
  lastLastYear: CameraDataForYear;
}

export interface CameraDataForYear {
  graphData: CameraDataForMonth[];
  total: number;
  year: number;
}

export interface CameraDataForMonth {
  amount: number;
  data: string;
}

export interface LineGraphProps {
  data: CameraGraphs;
  title: string;
}

export interface BarGraphProps {
  data: GraphsData | null;
}
