import {initShowingsView} from "./showings.js";
import {initializeViewNavigation} from "./router.js";
import {checkForHttpErrors} from "./util.js";

const MOVIES_URL = "http://127.0.0.1:8080/api/v1/movies"
let allFilteredMovies = [];
const MOVIES_PER_PAGE = 10;






async function initMoviesView() {
    await loadAllMovies();
    await loadGenres();
    await updateTable();
    console.log('Movies view initialized');
}






// not used
const loadMovies = async () => {
    let movies = await getFilteredMovies();
    let movieContainer = moviesHTMLFormatter(movies);
    let moviesDiv = document.getElementById('movies-div');
    moviesDiv.innerHTML = ''; // Clear existing content
    moviesDiv.appendChild(movieContainer);
}






const loadAllMovies = async () => {
    allFilteredMovies = await getFilteredMovies();
    renderPage(1);
}






const renderPage = (page) => {
    const startIndex = (page - 1) * MOVIES_PER_PAGE;
    const endIndex = startIndex + MOVIES_PER_PAGE;
    const moviesToDisplay = allFilteredMovies.slice(startIndex, endIndex);

    let movieContainer = moviesHTMLFormatter(moviesToDisplay);
    let moviesDiv = document.getElementById('movies-div');
    moviesDiv.innerHTML = ''; // Clear existing content
    moviesDiv.appendChild(movieContainer);

    renderPaginationControls(page);
}






const renderPaginationControls = (currentPage) => {
    const totalPages = Math.ceil(allFilteredMovies.length / MOVIES_PER_PAGE);
    let paginationDiv = document.getElementById('pagination-div');
    paginationDiv.innerHTML = ''; // Clear existing content

    for (let i = 1; i <= totalPages; i++) {
        let pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'mr-1');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => renderPage(i));
        paginationDiv.appendChild(pageButton);
    }
}

const loadGenres = async () => {
    let genres = await getGenres();
    document.getElementById('genre-select').innerHTML = genresHTMLFormatter(genres); // insert list
}







async function getAllActiveMovies() {
    try {
        const response = await fetch(MOVIES_URL);
        checkForHttpErrors(response);
        return await response.json();

    }catch (error) {
        console.error(error)
    }
}






//change structure so this function is only run when the filter btn is clicked else run the getAllActiveMovies.
const getFilteredMovies = async () => { ///movies?genre=&age=
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

export async function getMovieSearchFilter() {
    let movieSearch = document.getElementById("movie-search")
    const movies = await getAllActiveMovies()
    console.log(movies)
    allFilteredMovies = movies.filter(movie => movie.title.includes(movieSearch));
    console.log("im being called!")
    console.log(allFilteredMovies)
    await updateTable();
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






const moviesHTMLFormatter = json => {
    let movieList = [];

    //is this not redundant?
    for (let movie of json) {
        let id = movie.id;
        let title = movie.title
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
        <div class="col">
            <div class="card h-100 bg-grey-blue d-flex flex-column no-border">
                <div style="position:relative">
                    <a href="#showings">
                        <img data-movie-id="${movie.id}" data-movie-title="${movie.title}" src="${movie.thumbnail}" class="card-img-top mb-1 rounded thumbnail" alt="${movie.title}">
                    </a>
                    <img src="${movie.pgRating}" class="inner-image" alt="${movie.ageLimit}">
                </div>
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-white mb-2">${movie.title}</h6>
                    <div class="mt-auto">
                        <a href="#showings">
                            <button data-movie-id="${movie.id}" data-movie-title="${movie.title}" class="btn btn-sm btn-primary">Buy ticket <img id="ticket-png" src="/images/tickets.png"></button>
                        </a>
                    </div>
                </div>
            </div>
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
/*
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
*/

const updateTable = async () => {
    document.getElementById('filter-btn').onclick = async (event) => {
        event.preventDefault();
        allFilteredMovies = await getFilteredMovies();
        renderPage(1); // Render the first page with the new filtered movies
    }
}






export { initMoviesView };
export { getAllActiveMovies };