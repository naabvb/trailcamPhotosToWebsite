export interface Route {
  name: string;
  route: string;
  selected: () => boolean;
}

export interface Timestamp {
  key: string;
  timestamp: string;
}

export interface Image {
  src: string;
  thumbnail: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  timestamp: string;
  model: string;
}

export interface ImageSet {
  key: string;
  values: Image[];
}
