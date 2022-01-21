import { Timestamp } from '../interfaces/data';
import { getTimestampsFromApi } from './apiService';
import { routeService } from './routeService';

export const localStorageService = {
  getTimestamps,
  updatelocalStorage,
  getLocalStorageItem,
  hasNewImages,
};

function updatelocalStorage() {
  if (!routeService.isLoginPage() && !routeService.isLogoutPage()) {
    localStorage.setItem(`rkj_${window.location.pathname}`, new Date().toString());
  }
}

async function getTimestamps(): Promise<Timestamp[]> {
  if (!routeService.isLoginPage() && !routeService.isLogoutPage()) {
    return await (
      await getTimestampsFromApi()
    ).data.timestamps;
  }
  return [];
}

function getLocalStorageItem(key: string) {
  return localStorage.getItem(key);
}

function hasNewImages(route: string, remoteTimestamps: Timestamp[]) {
  const localStorageTimestamp = getLocalStorageItem(`rkj_${route}`);
  if (localStorageTimestamp) {
    const remoteTimestamp = remoteTimestamps.find((item) => item.key === route)?.timestamp;
    if (remoteTimestamp) {
      return new Date(remoteTimestamp).getTime() > new Date(localStorageTimestamp).getTime();
    }
  }
  return false;
}
