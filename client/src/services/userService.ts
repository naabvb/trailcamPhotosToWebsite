import { AxiosResponse } from 'axios';
import { Role } from '../constants/constants';
import { authenticate, getRoleFromApi } from './apiService';

export const userService = {
  login,
  getRole,
  hasRole,
};

export async function getRole(): Promise<Role> {
  try {
    return await (
      await getRoleFromApi()
    ).data.role;
  } catch (e) {
    return Role.None;
  }
}

async function login(username: string, password: string): Promise<string> {
  try {
    const response = await authenticate(username, password);
    return handleResponse(response);
  } catch (e) {
    return Promise.reject('Antamasi käyttäjätunnus tai salasana on väärin!');
  }
}

function hasRole(role: string) {
  return role === Role.Jatkala || role === Role.Vastila;
}

function handleResponse(response: AxiosResponse): Promise<string> {
  if (response.data.role) {
    return response.data.role;
  } else {
    return Promise.reject('Antamasi käyttäjätunnus tai salasana on väärin!');
  }
}
