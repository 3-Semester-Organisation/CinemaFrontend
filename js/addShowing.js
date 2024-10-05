import {checkForErrors, makeOption} from "./util.js";
import {getMovies} from "./movies.js";

const SHOWINGS_URL = "http://127.0.0.1:8080/api/v1/showing"

function initOptions() {
    initTheatreOptions();
    initMovieOptions();

    const createShowingBtn = document.getElementById("create-showing-btn");
    createShowingBtn.addEventListener("click", createShowing);

}


function initTheatreOptions() {
    const theatreOptions = document.getElementById("theatre-options");
    let allTheatres = [
        {
            id: 1,
            title: "sal1",
        },
        {
            id: 2,
            title: "sal2",
        },
        {
            id: 3,
            title: "sal3"
        }
    ];

    //getAllTheatres();
    allTheatres.sort((theatre1, theatre2) => theatre1.id - theatre2.id);

    theatreOptions.innerHTML += `<option selected></option>`;
    for (const theatre of allTheatres) {
        theatreOptions.innerHTML += `<option value="${theatre.id}">${theatre.title}</option>`;

    }
}


function initMovieOptions() {
    const dropDownOptions = document.getElementById("movie-options");

    let allMovies = getMovies()
    allMovies.sort((movie1, movie2) => movie1.id - movie2.id);

    dropDownOptions.innerHTML += `<option selected></option>`;
    for (const movie of allMovies) {
        dropDownOptions.innerHTML += `<option value="${movie.id}">${movie.title}</option>`;

    }
}


async function createShowing() {
    const theatreId = document.getElementById("theatre-options").value;
    const movieId = document.getElementById("movie-options").value;
    const startTime = document.getElementById("start-time").value;

    if (!theatreId) {
        alert("you need to choose a theatre.");
        return;
    }
    if (!movieId) {
        alert("you need to choose a movie.");
        return;
    }
    if (!startTime) {
        alert("you need to schedule a time of showing.");
        return;
    }

    const newShowing = {
        theatreId: theatreId,
        movieId: movieId,
        startTime: startTime
    }

    const postOption = makeOption("POST", newShowing);

    try {
        const response = await fetch(SHOWINGS_URL, postOption);
        checkForErrors(response);
        let createdShowing = await response.json();
        alert("you created the following showing: " + createdShowing);
        resetForm();

    } catch (error) {
        alert("A error occurred while trying to create the showing.")
    }
}

function resetForm() {
    document.getElementById("theatre-options").value = "";
    document.getElementById("movie-options").value = "";
    document.getElementById("start-time").value = "";
}

export {initOptions};