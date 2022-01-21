export const jatkalaRoutes = ['j1', 'j2', 'j3', 'j4'];
export const vastilaRoutes = ['v1', 'v2'];

export const buckets = {
  j1: { name: 'riistakamera-j1', trashBucket: 'riistakamera-trash-j1', url: process.env.j1!! },
  j2: { name: 'riistakamera-j2', trashBucket: 'riistakamera-trash-j2', url: process.env.j2!! },
  j3: { name: 'riistakamera-j3', trashBucket: 'riistakamera-trash-j3', url: process.env.j3!! },
  j4: { name: 'riistakamera-j4', trashBucket: 'riistakamera-trash-j4', url: process.env.j4!! },
  v1: { name: 'riistakamera-v1', trashBucket: 'riistakamera-trash-v1', url: process.env.v1!! },
  v2: { name: 'riistakamera-v2', trashBucket: 'riistakamera-trash-v2', url: process.env.v2!! },
};

export enum Cameras {
  j1 = 'j1',
  j2 = 'j2',
  j3 = 'j3',
  j4 = 'j4',
  v1 = 'v1',
  v2 = 'v2',
}

export enum Role {
  Jatkala = 'jatkala',
  Vastila = 'vastila',
  None = 'none',
}
