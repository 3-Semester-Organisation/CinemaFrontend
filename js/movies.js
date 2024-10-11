import {initShowingsView} from "./showings.js";
import {initializeViewNavigation, loadView, loadViewWithoutScript} from "./router.js";
import {checkForHttpErrors} from "./util.js";

const MOVIES_URL = "http://127.0.0.1:8080/api/v1/movies"
const FILTERED_MOVIES_URL = "http://localhost:8080/api/v1/movies/filter"
let allFilteredMovies = [];
const MOVIES_PER_PAGE = 10;


async function initMoviesViewScript() {
    await loadAllMovies();
    await loadGenres();
    await updateTable();
    console.log('Movies view initialized');
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
    if (moviesDiv) {
        moviesDiv.innerHTML = ''; // Clear existing content
    moviesDiv.appendChild(movieContainer);
    }
    
    renderPaginationControls(page);
}


const renderPaginationControls = (currentPage) => {
    const totalPages = Math.ceil(allFilteredMovies.length / MOVIES_PER_PAGE);
    let paginationDiv = document.getElementById('pagination-div');
    paginationDiv.innerHTML = ''; // Clear existing content

    const paginationList = document.createElement('ul');
    paginationList.classList.add('pagination', 'justify-content-center', 'pagination-custom');

    for (let i = 1; i <= totalPages; i++) {
        const paginationItem = document.createElement('li');
        paginationItem.classList.add('page-item');
        if (i === currentPage) {
            paginationItem.classList.add('active');
        }

        const paginationLink = document.createElement('a');
        paginationLink.classList.add('page-link');
        paginationLink.href = '#';
        paginationLink.innerText = i;
        paginationLink.addEventListener('click', (event) => {
            event.preventDefault();
            renderPage(i);
        });

        paginationItem.appendChild(paginationLink);
        paginationList.appendChild(paginationItem);
    }

    paginationDiv.appendChild(paginationList);
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
        const res = await fetch(`${FILTERED_MOVIES_URL}?genre=${genreChoice}&age=${ageChoice}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        if (res.status === 204){
            return [];
        }

        const movies = await res.json();
        return movies;
    } catch (error) {
        console.error('Problem with fetch operation on getMovies: ', error);
    }
}

const getAllMovies = async () => {
    try {
        const res = await fetch(MOVIES_URL + "/all");
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const movies = await res.json();
        return movies;
    } catch (error) {
        console.error('Problem with fetch operation on getMovies: ', error);
    }
}


//TODO fix genre/age-search functionality to work alongside name search
async function getMovieSearchFilter(event) {
    event.preventDefault();
    await loadViewWithoutScript("movies")
    let movieSearch = document.getElementById("movie-search").value.toLowerCase()
    console.log("searching for: " + movieSearch)
    const movies = await getAllActiveMovies()
    console.log(movies)
    allFilteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(movieSearch))
    console.log("im searching very hard!")
    console.log(allFilteredMovies)
    await loadGenres() //without this the genre list has no content
    renderPage(1)
}


const getGenres = async () => {
    try {
        const resp = await fetch(`${MOVIES_URL}/genres`);
        if (!resp.ok) {
            throw new Error('Network response was not ok');
        }
        const genres = await resp.json();
        return genres;
    } catch (error) {
        console.error('Problem with fetch operation on getMovies: ', error);
    }
}

const loadGenres = async () => {
    let genres = await getGenres();
    document.getElementById('genre-select').innerHTML = genresHTMLFormatter(genres);
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

    
    // den her funktion er kun nødvendig da vi sætter pgRating i frontend.    
    let movieList = json.map(movie => ({
        id: movie.id,
        title: movie.title,
        description: movie.description,
        genres: movie.genreList.join(", "),
        ageLimit: movie.ageLimit,
        thumbnail: movie.thumbnail,
        pgRating: pgRatingSelector(movie.ageLimit),
    }));
    

    let movieContainer = document.createElement("div");
    movieContainer.classList.add("row", "row-cols-1", "row-cols-md-5", "g-4");
    
    for (let movie of movieList) {
        movieContainer.innerHTML += `
        <div class="col">
            <div class="card h-100 bg-grey-blue d-flex flex-column no-border">
                <div>
                    <a href="#showings">
                        <img data-movie-id="${movie.id}" data-movie-title="${movie.title}" src="${movie.thumbnail}" class="card-img-top mb-1 rounded thumbnail" alt="${movie.title}">
                    </a>
                </div>
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-white mb-2">${movie.title}</h6>
                    <div class="mt-auto">
                        <a href="#showings" data-movie-id="${movie.id}" data-movie-title="${movie.title}" class="btn btn-sm btn-primary">
                            Buy ticket <img id="ticket-png" src="/images/ticket.svg">
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
        // initializeViewNavigation() // not needed
        initShowingsView(movieId, movieTitle);
    }
}


const genresHTMLFormatter = genres => {
    return `<option value="" selected>Select Genre</option>` 
    + genres.map(genre => `<option value="${genre}">${genre}</option>`).join('');
}

const updateTable = async () => {
    document.getElementById('filter-form').onchange = async (event) => {
        event.preventDefault();
        allFilteredMovies = await getFilteredMovies();
        renderPage(1); // Render the first page with the new filtered movies
    }
}

export { initMoviesViewScript,
    getAllActiveMovies, 
    getMovieSearchFilter,
    getFilteredMovies,
    getGenres,
    loadGenres,
    moviesHTMLFormatter,
    pgRatingSelector,
    updateTable,
    renderPage,
    renderPaginationControls,
    handleClick,
    getAllMovies };