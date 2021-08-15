import axios from 'axios';

export const userService = {
  login,
  getRole,
  hasRole,
};

export async function getRole(param) {
  try {
    const response = await axios.get('/api/get-role');
    if (response.data.role === 'jatkala' || response.data.role === 'vastila') {
      if (param) return true;
      return response.data.role;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

async function login(username, password) {
  try {
    const response = await axios.get('/api/authenticate', { auth: { username, password } });
    handleResponse(response);
  } catch (e) {
    return Promise.reject('Antamasi käyttäjätunnus tai salasana on väärin!');
  }
}

function hasRole(role) {
  return role === 'vastila' || role === 'jatkala';
}

function handleResponse(response) {
  if (response.data.role) {
    return response.data.role;
  } else {
    return Promise.reject('Antamasi käyttäjätunnus tai salasana on väärin!');
  }
}
