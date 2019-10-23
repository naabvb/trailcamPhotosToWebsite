
import { authHeader } from '../_helpers/auth-header';
import axios from 'axios';

export const userService = {
    login,
    logout,
    getAll,
    getRole
};

async function getRole() {
    try {
        console.log("called");
        const response = await axios.get('/api/get-role')
        if (response.data.role == 'jatkala') {
            console.log("true")
            return true;
        }
        else {
            return false;
        }
    } catch (e) {
        console.log("getRole vir: " + e);
        return false;
    }
}


async function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };
    try {
        const response = await axios.get('/api/authenticate', {auth: {username, password}})
        handleResponse(response);
    } catch (e) {
        console.log("Virhe: " +e);
        return Promise.reject("Antamasi käyttäjätunnus tai salasana on väärin!")
    }

    //return fetch(`http://localhost:5000/users/authenticate`, requestOptions)
    //    .then(handleResponse)
    //    .then(user => {
    //        // login successful if there's a user in the response
    //        if (user) {
    //            // store user details and basic auth credentials in local storage 
    //            // to keep user logged in between page refreshes
    //            user.authdata = window.btoa(username + ':' + password);
    //            localStorage.setItem('user', JSON.stringify(user));
    //        }
//
    //        return user;
    //    });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`http://localhost:5000/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    console.log(response)
    if (response.data.role) {
        return response.data.role;
    }

    else {
        console.log("pieleen")
        return Promise.reject("Antamasi käyttäjätunnus tai salasana on väärin!")
    }

  //  return response.data().then(text => {
  //      const data = text && JSON.parse(text);
  //      if (!response.ok) {
  //          if (response.status === 401) {
  //              // auto logout if 401 response returned from api
  //              logout();
  //              window.location.reload(true);
  //          }
//
  //          const error = (data && data.message) || response.statusText;
  //          return Promise.reject(error);
  //      }
//
  //      return data;
  //  });
}