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


function checkForErrors(response) {
    if (!response.ok) {
        let errorResponse = response.json();
        let error = new Error(errorResponse.message);
        error.apiError = errorResponse;
        throw error;
    }
}

export {checkForErrors};
export {makeOption};