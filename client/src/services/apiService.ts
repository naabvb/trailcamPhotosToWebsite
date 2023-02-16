import axios from 'axios';

export async function getImagesFromApi(cameraTag: string) {
  return await axios.get(`/api/images${cameraTag}`);
}

export async function getTimestampsFromApi() {
  return await axios.get('/api/timestamps');
}

export async function getRoleFromApi() {
  return await axios.get('/api/get-role');
}

export async function getGraphsDataFromApi() {
  return await axios.get('/api/graphs');
}

export async function authenticate(username: string, password: string) {
  return await axios.get('/api/authenticate', { auth: { username, password } });
}

export async function logout() {
  await axios.get('/api/clear-role');
}

export async function deleteImage(url: string) {
  await axios.get('/api/delete-image', {
    params: {
      img_url: url,
    },
  });
}
