const MOVIES_URL = "http://127.0.0.1:8080/api/v1/movies"

async function initMoviesView() {
    await loadMovies();
    await loadGenres();
    await updateTable();
    console.log('Movies view initialized');
}

const loadMovies = async () => {
    let movies = await getMovies();
    let movieHtml = moviesHTMLFormatter(movies);
    document.getElementById('movies-div').innerHTML = movieHtml; // insert list
}
const loadGenres = async () => {
    let genres = await getGenres();
    let movieHtml = genresHTMLFormatter(genres);
    document.getElementById('genre-select').innerHTML = movieHtml; // insert list
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
        return genres;
    } catch (error) {
        console.error('Problem with fetch operation on getMovies: ', error);
    }
}

const moviesHTMLFormatter = json => {
    let movieList = [];

    for (let movie of json) {
        let id = movie.id;
        let title = movie.title;
        let description = movie.description;
        let genres = movie.genreList.join(", ");
        let ageLimit = movie.ageLimit;
        let thumbnail = movie.thumbnail;

        movieList.push({
            id: id,
            title: title,
            description: description,
            genres: genres,
            ageLimit: ageLimit,
            thumbnail: thumbnail,
        });
    }

    let html = `<div class="row row-cols-1 row-cols-md-5 g-4">`;

    for (let movie of movieList) {
        html += `
        <div class="col mb-4">
        <a href="${movie.showings}" style="text-decoration: none;"> <!-- TODO link til moviens showings her!! -->
            <div class="card h-100 bg-grey-blue d-flex flex-column no-border">
                <img src="${movie.thumbnail}" class="card-img-top mb-2 rounded thumbnail" style="box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);" alt="${movie.title}">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title text-white">${movie.title}</h5>
                
                    <div class="mt-auto">
                    <button class="btn btn-sm btn-primary">Buy ticket</button>
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

    html += `</div>`;

    return html;
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
        let movieHtml;
        if (!movies || movies.length === 0) {
            movieHtml = `<p>No movies found matching your criteria.</p>`;
        } else {
            movieHtml = moviesHTMLFormatter(movies);

        }
        document.getElementById('movies-div').innerHTML = movieHtml;
    }
}








export { initMoviesView };