import {checkForHttpErrors, makeAuthOption} from "./util.js";

function initAddMovieView() {
    const addButton = document.getElementById('add');
    if (addButton) {
        addButton.onclick = async () => {
            let movieTitle = document.getElementById('input').value;
            movieTitle = movieTitle.replace(/ /g, "+");
            let movie = await getMovie(movieTitle);
            postMovie(movie);
            alert('Movie added!');
            document.getElementById('input').value = ''; // reset input field
        };
    } else {
        console.error('Add button not found');
    }
    console.log('Add movie view initialized');
}

const getMovie = async movieTitle => {
    try {
        // prob should hide api key somehow, but it's free so whatever
        const res = await fetch(`https://www.omdbapi.com/?apikey=7419760&t=${movieTitle}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const movie = await res.json();
        return movie;
    } catch (error) {
        console.error('Problem with fetch operation on getMovie: ', error);
    }
}

const postMovie = async movie => {

    const ratingMap = {
        'G': 0,
        'PG': 0,
        'PG-13': 13,
        'R': 17,
        'NC-17': 17
    }

    // create a new movie object from response
    const newMovie = {
        title: movie.Title,
        description: movie.Plot,
        genres: movie.Genre,
        rating: movie.Rated,
        thumbnail: movie.Poster,
        ageLimit: ratingMap[movie.Rated],
        runtime: movie.Runtime,
        imdbId: movie.imdbID
    }

    try {
        const token = localStorage.getItem("jwtToken");
        const postOption = makeAuthOption("POST", newMovie, token);
        const res = await fetch('http://localhost:8080/api/v1/movies/addmovie', postOption);
        checkForHttpErrors(res)
        const addedMovie = await res.json();

        console.log(JSON.stringify(addedMovie));

    } catch (error) {
        console.error('Problem with fetch operation on postMovie: ', error);
    }
}

export {initAddMovieView};