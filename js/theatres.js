import {checkForHttpErrors} from "./util.js";

const ALL_THEATRES_URL = "http://localhost:8080/api/v1/theatres/all";

let allTheatres = [];
async function getAllTheatres() {
    try {
        if (allTheatres.length === 0) {
            const response = await fetch(ALL_THEATRES_URL);
            checkForHttpErrors(response);
            allTheatres = await response.json();
        }

        return allTheatres;

    }catch (error) {
        alert("something went wrong: \n" + error);
        console.error(error);
    }
}

export { getAllTheatres }