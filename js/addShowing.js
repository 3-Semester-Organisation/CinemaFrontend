import {checkForHttpErrors, makeOption} from "./util.js";
import {getAllActiveMovies} from "./movies.js";
import {getAllTheatres} from "./theatres.js";
import {getLatestShowingByTheatreId} from "./showings.js";

const SHOWING_URL = "http://127.0.0.1:8080/api/v1/showing"






function initOptions() {
    initTheatreOptions();
    initMovieOptions();

    const createShowingBtn = document.getElementById("create-showing-btn");
    createShowingBtn.addEventListener("click", createShowing);
}






async function initTheatreOptions() {
    const theatreOptions = document.getElementById("theatre-options");
    let allTheatres = await getAllTheatres();
    allTheatres.sort((theatre1, theatre2) => theatre1.id - theatre2.id);

    //generally dont use innerHTMl and use document.createElement for better protection against XSS (Cross-Site Scripting)
    theatreOptions.innerHTML += `<option selected></option>`;
    for (const theatre of allTheatres) {
        theatreOptions.innerHTML += `<option value="${theatre.id}">${theatre.name}</option>`;

    }
}






async function initMovieOptions() {
    const dropDownOptions = document.getElementById("movie-options");

    let allMovies = await getAllActiveMovies()
    allMovies.sort((movie1, movie2) => movie1.id - movie2.id);

    dropDownOptions.innerHTML += `<option selected></option>`;
    for (const movie of allMovies) {
        dropDownOptions.innerHTML += `<option value="${movie.id}">${movie.title}</option>`;

    }
}






async function createShowing() {

    const newShowing = ifAllInputFieldsFilled(); //returns a newShowing if all input fields are filed.
    if (!newShowing) {
        return;
    }
    const newShowingStartTime = new Date(newShowing.startTime);

    try {

        const theatreAvailabilityTime = await calculateAvailableTime(newShowing);
        console.log("ava: " + theatreAvailabilityTime);
        console.log("new starttime" + newShowingStartTime);
        if (newShowingStartTime <= theatreAvailabilityTime) {
            alert("the scheduled time for the new showing conflicts with an existing showing.")
            return;
        }

        const postOption = makeOption("POST", newShowing);

        const response = await fetch(SHOWING_URL, postOption);
        checkForHttpErrors(response);
        let createdShowing = await response.json();
        alert("you created the following showing: " + createdShowing);
        resetForm();

    } catch (error) {
        console.error("Error details:", error);
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

    console.log("before split: " + latestShowingStartTime);
    let durationSplitArray = latestShowing.movie.runtime.split(" "); //beacuse this value is null in the db, this whole function dont work. it stops running after it encounters the error
    const latestShowingMovieDuration = Number(durationSplitArray[0]);
    const prepareTimeTheatre = 30;

    //calculating the time when the theatre is avaliable again by adding movie duration and cleaning time to the original start time of movie from latest showing.
    latestShowingStartTime.setMinutes(latestShowingStartTime.getMinutes() + latestShowingMovieDuration + prepareTimeTheatre);
    console.log("afet split: " + latestShowingStartTime)

    const calculatedAvailabilityTime = latestShowingStartTime;

    return calculatedAvailabilityTime;
}






export {initOptions};