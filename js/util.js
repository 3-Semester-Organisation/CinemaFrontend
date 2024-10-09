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

export {checkForHttpErrors};
export {makeOption};
export {makeAuthOption};