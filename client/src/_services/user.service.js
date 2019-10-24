import axios from 'axios';

export const userService = {
    login,
    getRole
};

export async function getRole(param) {
    try {
        console.log("called");
        const response = await axios.get('/api/get-role')
        if (response.data.role === 'jatkala' || response.data.role === 'vastila') {
            console.log("true")
            if (param === true) return true;
            return response.data.role;
        }
        else {
            if (param === true) return false;
            return false;
        }
    } catch (e) {
        console.log("getRole vir: " + e);
        return false;
    }
}


async function login(username, password) {
    try {
        const response = await axios.get('/api/authenticate', {auth: {username, password}})
        handleResponse(response);
    } catch (e) {
        console.log("Virhe: " +e);
        return Promise.reject("Antamasi käyttäjätunnus tai salasana on väärin!")
    }

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

}