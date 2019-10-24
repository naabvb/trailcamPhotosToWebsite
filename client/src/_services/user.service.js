import axios from 'axios';

export const userService = {
    login,
    getRole
};

export async function getRole(param) {
    try {
        const response = await axios.get('/api/get-role')
        if (response.data.role === 'jatkala' || response.data.role === 'vastila') {
            if (param === true) return true;
            return response.data.role;
        }
        else {
            if (param === true) return false;
            return false;
        }
    } catch (e) {
        console.log("Role could not be retrieved: " + e);
        return false;
    }
}

async function login(username, password) {
    try {
        const response = await axios.get('/api/authenticate', { auth: { username, password } })
        handleResponse(response);
    } catch (e) {
        return Promise.reject("Antamasi käyttäjätunnus tai salasana on väärin!")
    }

}

function handleResponse(response) {
    if (response.data.role) {
        return response.data.role;
    }
    else {
        return Promise.reject("Antamasi käyttäjätunnus tai salasana on väärin!")
    }

}