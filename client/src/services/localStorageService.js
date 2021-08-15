import axios from 'axios';
import { routeService } from './routeService';

export const localStorageService = {
  getTimestamps,
  updatelocalStorage,
  getLocalStorageItem,
  hasNewImages,
};

function updatelocalStorage() {
  if (!routeService.isLoginPage() && !routeService.isLogoutPage()) {
    localStorage.setItem(`rkj_${window.location.pathname}`, new Date());
  }
}

async function getTimestamps() {
  if (!routeService.isLoginPage() && !routeService.isLogoutPage()) {
    return await (
      await axios.get('/api/timestamps')
    ).data.timestamps;
  }
  return [];
}

function getLocalStorageItem(key) {
  return localStorage.getItem(key);
}

function hasNewImages(route, remoteTimestamps) {
  const localStorageTimestamp = getLocalStorageItem(`rkj_${route}`);
  if (localStorageTimestamp) {
    return (
      new Date(remoteTimestamps.find((item) => item.key === route)?.timestamp).getTime() >
      new Date(localStorageTimestamp).getTime()
    );
  }
  return false;
}
