import {checkForHttpErrors, makeOption} from "./util.js";
import {getMovies} from "./movies.js";
import {getAllTheatres} from "./theatres.js";
import {getLatestShowingByTheatreId} from "./showings";

const SHOWINGS_URL = "http://127.0.0.1:8080/api/v1/showing"






function initOptions() {
    initTheatreOptions();
    initMovieOptions();

    const createShowingBtn = document.getElementById("create-showing-btn");
    createShowingBtn.addEventListener("click", createShowing);
}






function initTheatreOptions() {
    const theatreOptions = document.getElementById("theatre-options");
    let allTheatres = getAllTheatres();
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

    const newShowing = ifAllInputFieldsFilled(); //returns a newShowing if all input fields are filed.
    const newShowingStartTime = new Date(newShowing.startTime);

    try {

        const theatreAvailabilityTime = calculateAvailableTime(newShowing);
        if (newShowingStartTime <= theatreAvailabilityTime) {
            alert("the scheduled time for the new showing conflicts with an existing showing.")
            return;
        }

        const postOption = makeOption("POST", newShowing);

        const response = await fetch(SHOWINGS_URL, postOption);
        checkForHttpErrors(response);
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






// Because the input fields are not wrapped in a form tag, when create-btn is clicked the "required" keyword dont work as intended.
// Therefor the existence of this method. Also prettier styling the back-btn and the same line/row of create.
// Would not be possible if it was inside the form, containing input fields that are marked with "required"
function ifAllInputFieldsFilled() {

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

    return newShowing;
}






// checks that the new showing is scheduled to start playing 30min after the previous movie has ended - time for clean up and what not.
async function calculateAvailableTime(newShowing) {

    const theatreId = newShowing.theatreId;
    const latestShowing = await getLatestShowingByTheatreId(theatreId);

    if (!latestShowing) {
        return new Date(0); //apparently this returns:  (January 1, 1970, 00:00:00 UTC). Its fine since we cant travel back in time aka, we dont want to create a showing back in the future.
    }

    const latestShowingStartTime = new Date(latestShowing.startTime);

    let durationSplitArray = latestShowing.movie.runtime.split(" ");
    const latestShowingMovieDuration = Number(durationSplitArray[0]);
    const prepareTimeTheatre = 30;

    //calculating the time when the theatre is avaliable again by adding movie duration and cleaning time to the original start time of movie from latest showing.
    latestShowingStartTime.setMinutes(latestShowingStartTime.getMinutes() + latestShowingMovieDuration + prepareTimeTheatre);
    const calculatedAvailabilityTime = latestShowingStartTime;

    return calculatedAvailabilityTime;
}






export {initOptions};