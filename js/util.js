const navbar = document.getElementById("navbar-content");
let defaultNavbar = navbar.innerHTML;



function makeOption(httpMethod, body) {
    const option = {
        method: httpMethod.toUpperCase(),
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }
    if (body) {
        option.body = JSON.stringify(body);
    }
    return option;
}

function makeAuthOption(httpMethod, body, token) {
    const option = {
        method: httpMethod.toUpperCase(),
        headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + token
        }
    }
    if (body) {
        option.body = JSON.stringify(body);
    }
    return option;
}


function checkForHttpErrors(response) {
    if (!response.ok) {
        let errorResponse = response.json();
        let error = new Error("statue: " + response.status + "\nMessage: " + errorResponse.message);
        error.apiError = errorResponse;
        throw error;
    }
}




function getDecodedToken() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
        return null;
    }
    const decodedToken = jwt_decode(token);
    return decodedToken;
}


export {checkForHttpErrors, makeOption, makeAuthOption, defaultNavbar, getDecodedToken};