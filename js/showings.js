import {checkForHttpErrors, makeAuthOption, makeOption} from "./util.js";

const SHOWINGS_URL = "http://127.0.0.1:8080/api/v1/showings"
const SHOWING_URL = "http://127.0.0.1:8080/api/v1/showing"
const DELETE_MOVIE_URL = "http://localhost:8080/api/v1/movies/delete"






async function initShowingsView(movieId, movieTitle) {
    // runs this code when you access the showings view
    await displayShowingsBy(movieId, movieTitle);
    console.log("Showings view initialized");
}

async function displayShowingsBy(movieId, movieTitle) {

    try {
        const response = await fetch(SHOWINGS_URL + "?movieId=" + movieId);
        checkForHttpErrors(response);
        const showingList = await response.json();

        // Retry mechanism for elements availability
        const movieTitleElement = document.getElementById("movie-title");
        const thumbnail = document.getElementById("movie-thumbnail");
        if (!movieTitleElement || !thumbnail) {
            setTimeout(() => displayShowingsBy(movieId, movieTitle), 100); // Retry after 100ms
            return;
        }

        //populates the HTMLelements such as img, h2 and p(description) with data.
        movieTitleElement.innerText = movieTitle;
        thumbnail.setAttribute("src", showingList[0].movie.thumbnail);
        thumbnail.setAttribute("alt", "poster of the movie: " + movieTitle.toString());
        thumbnail.classList.add("poster", "rounded");

        const movieDescription = document.getElementById("movie-description");
        movieDescription.innerText = showingList[0].movie.description;

        const showingsGrid = document.getElementById("showings-grid");
        const nextSevenDaysFromCurrentDate = getNextSevenDays();

        // delete functionality //should be moved to a seperate page
        const deleteMovieButton = document.getElementById("delete-button");
        deleteMovieButton.addEventListener("click", () => {
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
        });

        document.getElementById("confirmDeleteButton").addEventListener("click", () => {
            deleteMovie(movieId);
        });

        //builds each colum for the next seven days starting from current day
        for (const showingDay of nextSevenDaysFromCurrentDate) {
            let column = buildColumn(showingDay, showingList);
            showingsGrid.appendChild(column);
        }
    } catch (error) {
        console.error(error.message);
    }
}


const deleteMovie = async (movieId) => {
    const url = `${DELETE_MOVIE_URL}?id=${movieId}`;
    const token = localStorage.getItem("jwtToken")
    const deleteOption = makeAuthOption("DELETE", null, token);

    try {
        const res = await fetch(url, deleteOption);
        checkForHttpErrors(res);
        window.location.href = "#movies";
    } catch (error) {
        console.error(error.message);
    }

    
}


function buildColumn(showingDay, showingList) {
    const column = document.createElement("div");
    column.classList.add("col");

    const header = document.createElement("div");
    header.classList.add("column-header", "text-center");

    const dateOptions = {weekday: 'short', month: 'short', day: 'numeric'};
    header.innerText = showingDay.toLocaleDateString('en-US', dateOptions); // Show full date as a header
    column.appendChild(header);

    //filters showingList to only contain the showing for the particular day.
    const filteredShowings = showingList.filter(showing => {
        const showingDate = parseJsonLocalDateTimeToDate(showing.startTime.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/));
        return showingDay.toDateString() === showingDate.toDateString();
    });

    //build each card in the colum for showing
    filteredShowings.forEach(showing => {
        let showingCard = buildCard(showing);
        column.appendChild(showingCard);
    });

    return column;
}






function buildCard(showing) {
    const showingCard = document.createElement("a");
    showingCard.classList.add("text-decoration-none");

    const showingDate = parseJsonLocalDateTimeToDate(showing.startTime.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/));

    const timeOptions = {hour: '2-digit', minute: '2-digit', hour12: false};
    const showingTime = showingDate.toLocaleTimeString('default', timeOptions);

    showingCard.innerHTML += `
                    <div class="card showing-card">
                        <div class="card-body">
                            <h7 class="card-title">${showing.theatre.name}</h7>
                            <h5 class="card-text">${showingTime}</h5>
                        </div>
                    </div>
                `;

    showingCard.addEventListener("click", displaySeatBooking)
    return showingCard;
}






function getNextSevenDays() {
    const daysArray = [];
    const currentDate = new Date();

    for (let i = 0; i < 7; i++) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + i);
        daysArray.push(nextDate);
    }

    return daysArray;
}






function parseJsonLocalDateTimeToDate(jsonLocalDateTime) {
    if (!jsonLocalDateTime) {
        console.error("Invalid LocalDateTime format");
        return
    }

    const year = parseInt(jsonLocalDateTime[1]);
    const month = parseInt(jsonLocalDateTime[2]) - 1; // Months are 0-based
    const day = parseInt(jsonLocalDateTime[3]);
    const hours = parseInt(jsonLocalDateTime[4]);
    const minutes = parseInt(jsonLocalDateTime[5]);
    const seconds = parseInt(jsonLocalDateTime[6]);

    return new Date(year, month, day, hours, minutes, seconds);
}


function displaySeatBooking() {
    alert("redirect to seatbooking")
}






async function getLatestShowingByTheatreId(theatreId) {
    try {
        const response = await fetch(SHOWING_URL + "?theatreId=" + theatreId)
        checkForHttpErrors(response);
        const latestShowing = response.json();

        return latestShowing;

    }catch (error) {
        throw error;
    }
}

// commented this out, runs in init function now
/*
document.addEventListener("DOMContentLoaded", () => {
    displayShowingsBy("Alien");
});
*/

export { initShowingsView };
export { getLatestShowingByTheatreId };