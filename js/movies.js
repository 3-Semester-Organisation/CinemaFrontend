import { initShowingsView } from "./showings.js";
import {initializeViewNavigation} from "./router.js";
import {checkForErrors} from "./util.js";
const MOVIES_URL = "http://127.0.0.1:8080/api/v1/movies"

async function initMoviesView() {
    await loadMovies();
    await loadGenres();
    await updateTable();
    console.log('Movies view initialized');
}

const loadMovies = async () => {
    let movies = await getMovies();
    let movieContainer = moviesHTMLFormatter(movies);
    let moviesDiv = document.getElementById('movies-div');
    moviesDiv.innerHTML = ''; // Clear existing content
    moviesDiv.appendChild(movieContainer);
}

const loadGenres = async () => {
    let genres = await getGenres();
    document.getElementById('genre-select').innerHTML = genresHTMLFormatter(genres); // insert list
}


async function getActiveMovies() {
    try {
        const response = await fetch(MOVIES_URL + "/active")
        checkForErrors(response);
        return await response.json();
    } catch (error) {
        alert("Something went wrong trying to fetch the active movies: " + error)
    }
}


const getMovies = async () => { ///movies?genre=&age=
    let genreChoice = document.getElementById("genre-select").value;
    let ageChoice = document.getElementById("age-select").value;
    if (ageChoice === "0") {ageChoice = ""}
    try {
        const resp = await fetch(`${MOVIES_URL}?genre=${genreChoice}&age=${ageChoice}`);
        if (!resp.ok) {
            throw new Error('Network response was not ok');
        }

        if (resp.status === 204){
            return [];
        }

        const movies = await resp.json();
        return movies;
    } catch (error) {
        console.error('Problem with fetch operation on getMovies: ', error);
    }
}
const getGenres = async () => {
    try {
        const resp = await fetch(`${MOVIES_URL}/genres`);
        if (!resp.ok) {
            throw new Error('Network response was not ok');
        }
        const genres = await resp.json();
        console.log(genres);
        return genres;
    } catch (error) {
        console.error('Problem with fetch operation on getMovies: ', error);
    }
}

// could be rewritten to use rating from omdb instead of ageLimit
function pgRatingSelector(ageLimit){
    if(ageLimit == 0) {
        return "images/MPA_G_RATING.svg.png";
    }else if(ageLimit < 13){
        return "images/MPA_PG_RATING.svg.png";
    }else if(ageLimit < 17){
        return "images/MPA_PG-13_RATING.svg.png";
    }else if(ageLimit < 18){
        return "images/MPA_R_RATING.svg.png";
    }else{
        return "images/MPA_NC-17_RATING.svg.png";
    }
}

function truncateTitle(title, maxLength) {
    if (title.length > maxLength) {
        return title.substring(0, maxLength - 3) + "...";
    }
    return title;
}

const moviesHTMLFormatter = json => {
    let movieList = [];

    //is this not redundant?
    for (let movie of json) {
        let id = movie.id;
        let title = truncateTitle(movie.title, 25);
        let description = movie.description;
        let genres = movie.genreList.join(", ");
        let ageLimit = movie.ageLimit;
        let thumbnail = movie.thumbnail;
        let pgRating = pgRatingSelector(movie.ageLimit);

        movieList.push({
            id: id,
            title: title,
            description: description,
            genres: genres,
            ageLimit: ageLimit,
            thumbnail: thumbnail,
            pgRating: pgRating,
        });
    }

    let movieContainer = document.createElement("div");
    movieContainer.classList.add("row", "row-cols-1", "row-cols-md-5", "g-4");
    

    for (let movie of movieList) {
        movieContainer.innerHTML += `
        <div class="col mb-4">
        <a style="text-decoration: none;"> <!-- TODO link til moviens showings her!! -->
            <div class="card h-100 bg-grey-blue d-flex flex-column no-border">
                <img src="${movie.thumbnail}" class="card-img-top mb-1 rounded thumbnail" alt="${movie.title}">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-white mb-4">${movie.title}</h6>
                    <div class="mt-auto">
                        <a href="#showings">
                            <button data-movie-id="${movie.id}" data-movie-title="${movie.title}" class="btn btn-sm btn-primary">Buy ticket</button>
                        </a>
                        <p class="card-text">
                            <small class="text-secondary">Recommended age: ${movie.ageLimit}</small>
                        </p>
                    </div>
                </div>
            </div>
        </a>
    </div>
    `;
    }

    movieContainer.addEventListener("click",  handleClick);

    return movieContainer;
}


function handleClick(event) {
    let target = event.target;

    if (target.dataset.movieId && target.dataset.movieTitle) {
        let movieId = target.dataset.movieId;
        let movieTitle = target.dataset.movieTitle;
        initializeViewNavigation()
        initShowingsView(movieId, movieTitle);
    }
}

const genresHTMLFormatter = json => {
    json.sort();
    let html = `<option value="" selected >Select a genre</option>`;
    for (let genre of json) {
        html += `<option value="${genre}">${genre}</option>`;
    }
    return html;
};

const updateTable = async () => {
    document.getElementById('filter-btn').onclick = async (event) => {
        event.preventDefault();

        let movies = await getMovies();
        let moviesDiv = document.getElementById('movies-div');
        moviesDiv.innerHTML = ''; // Clear existing content

        if (!movies || movies.length === 0) {
            moviesDiv.innerHTML = `<p>No movies found matching your criteria.</p>`;
        } else {
            let movieContainer = moviesHTMLFormatter(movies);
            moviesDiv.appendChild(movieContainer);
        }
    }
}

export { initMoviesView };
export { getActiveMovies };